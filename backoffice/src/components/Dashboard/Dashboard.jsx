import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import { format, isAfter, isEqual, parseISO, startOfToday } from 'date-fns'
import { es } from 'date-fns/locale'
import { useForm } from 'react-hook-form'
import {
  createResource,
  deleteResource,
  getCollection,
  registerAttendeeToTalk,
  unregisterAttendeeFromTalk,
  updateResource,
} from '../../services/apiService'
import logoEmprenbit from '../../../../assets/logo-emprenbit.jpg'
import './Dashboard.css'

const initialState = {
  talks: [],
  attendees: [],
  speakers: [],
  users: [],
  isLoading: true,
  error: '',
  notice: '',
  editing: {},
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, isLoading: true, error: '' }
    case 'LOAD_SUCCESS':
      return { ...state, ...action.payload, isLoading: false, error: '' }
    case 'LOAD_ERROR':
      return { ...state, isLoading: false, error: action.payload }
    case 'NOTICE':
      return { ...state, notice: action.payload, error: '' }
    case 'ERROR':
      return { ...state, error: action.payload, notice: '' }
    case 'EDIT':
      return { ...state, editing: { ...state.editing, [action.resource]: action.payload }, notice: '', error: '' }
    default:
      return state
  }
}

const locationLabels = {
  auditorium: 'Auditorio',
  pressRoom: 'Sala de prensa',
  emprenbitSpace: 'Espacio Emprenbit',
  mallorca: 'Mallorca',
  menorca: 'Menorca',
  ibiza: 'Ibiza',
  other: 'Otro',
}

const discoveryLabels = {
  socialMedia: 'Redes sociales',
  mailing: 'Mailing',
  wordOfMouth: 'Boca a boca',
  noneOfTheAbove: 'Ninguna de las anteriores',
}

const getId = (value) => value?._id || value?.id || value
const getIds = (values = []) => values.map(getId).filter(Boolean)
const toInputDate = (value) => (value ? value.slice(0, 10) : '')
const formatDate = (value) => (value ? format(parseISO(value), 'dd MMM yyyy', { locale: es }) : 'Sin fecha')

const countTalkAttendees = (talk) => talk.attendeeIds?.length || 0

const buildTalkPayload = (values, speakerIds) => ({
  title: values.title.trim(),
  description: values.description.trim(),
  date: values.date,
  time: values.time,
  location: values.location,
  speakerIds,
})

const Dashboard = ({ token, user, onLogout }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  const handleToggleMobileNav = () => {
    setIsMobileNavOpen((isOpen) => !isOpen)
  }

  const handleCloseMobileNav = () => {
    setIsMobileNavOpen(false)
  }

  const handleHeaderKeyDown = (event) => {
    if (event.key === 'Escape') {
      handleCloseMobileNav()
    }
  }

  const loadDashboardData = useCallback(async () => {
    dispatch({ type: 'LOAD_START' })

    try {
      const [talks, attendees, speakers, users] = await Promise.all([
        getCollection('talks', token),
        getCollection('attendees', token),
        getCollection('speakers', token),
        getCollection('users', token),
      ])

      dispatch({ type: 'LOAD_SUCCESS', payload: { talks, attendees, speakers, users } })
    } catch (error) {
      dispatch({ type: 'LOAD_ERROR', payload: error.message || 'No se pudo cargar el dashboard' })
    }
  }, [token])

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  const metrics = useMemo(() => {
    const today = startOfToday()
    const currentTalks = state.talks.filter((talk) => {
      const talkDate = parseISO(talk.date)
      return isAfter(talkDate, today) || isEqual(talkDate, today)
    })
    const historicalTalks = state.talks.length - currentTalks.length

    return {
      currentTalks,
      historicalTalks,
      historicalAttendees: state.attendees.length,
      totalTalks: state.talks.length,
    }
  }, [state.talks, state.attendees.length])

  const handleDelete = async (resource, id, label) => {
    const isConfirmed = window.confirm(`¿Seguro que quieres eliminar ${label}? Esta acción no se puede deshacer.`)
    if (!isConfirmed) return

    try {
      await deleteResource(resource, token, id)
      dispatch({ type: 'NOTICE', payload: 'Registro eliminado correctamente.' })
      await loadDashboardData()
    } catch (error) {
      dispatch({ type: 'ERROR', payload: error.message || 'No se pudo eliminar el registro' })
    }
  }

  const handleSuccess = async (message) => {
    dispatch({ type: 'NOTICE', payload: message })
    await loadDashboardData()
  }

  return (
    <div className="admin-shell">
      <header className="admin-header" onKeyDown={handleHeaderKeyDown}>
        <NavLink className="admin-brand" to="/" aria-label="Ir al resumen del dashboard" onClick={handleCloseMobileNav}>
          <img src={logoEmprenbit} alt="Emprenbit" />
          <span>Backoffice Tramuntana Talks</span>
        </NavLink>

        <button
          className="mobile-menu-toggle"
          type="button"
          aria-label={isMobileNavOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
          aria-controls="backoffice-navigation"
          aria-expanded={isMobileNavOpen}
          onClick={handleToggleMobileNav}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>

        <nav
          id="backoffice-navigation"
          className={`admin-nav${isMobileNavOpen ? ' admin-nav--open' : ''}`}
          aria-label="Secciones del backoffice"
        >
          <NavLink to="/" onClick={handleCloseMobileNav}>Resumen</NavLink>
          <NavLink to="/talks" onClick={handleCloseMobileNav}>Charlas</NavLink>
          <NavLink to="/attendees" onClick={handleCloseMobileNav}>Inscritos</NavLink>
          <NavLink to="/speakers" onClick={handleCloseMobileNav}>Ponentes</NavLink>
          <NavLink to="/users" onClick={handleCloseMobileNav}>Usuarios</NavLink>
        </nav>

        <div className="session-box">
          <span>{user.fullName}</span>
          <button type="button" onClick={() => onLogout()}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="admin-main">
        {state.notice ? <p className="admin-alert admin-alert--success">{state.notice}</p> : null}
        {state.error ? <p className="admin-alert admin-alert--error">{state.error}</p> : null}
        {state.isLoading ? (
          <section className="dashboard-panel" aria-live="polite">Cargando datos del backoffice...</section>
        ) : (
          <Routes>
            <Route path="/" element={<Overview talks={state.talks} metrics={metrics} />} />
            <Route
              path="/talks"
              element={
                <TalksSection
                  editing={state.editing.talks}
                  speakers={state.speakers}
                  talks={state.talks}
                  token={token}
                  onDelete={handleDelete}
                  onEdit={(talk) => dispatch({ type: 'EDIT', resource: 'talks', payload: talk })}
                  onSuccess={handleSuccess}
                />
              }
            />
            <Route
              path="/attendees"
              element={
                <AttendeesSection
                  attendees={state.attendees}
                  editing={state.editing.attendees}
                  talks={state.talks}
                  token={token}
                  onDelete={handleDelete}
                  onEdit={(attendee) => dispatch({ type: 'EDIT', resource: 'attendees', payload: attendee })}
                  onSuccess={handleSuccess}
                />
              }
            />
            <Route
              path="/speakers"
              element={
                <SpeakersSection
                  editing={state.editing.speakers}
                  speakers={state.speakers}
                  token={token}
                  onDelete={handleDelete}
                  onEdit={(speaker) => dispatch({ type: 'EDIT', resource: 'speakers', payload: speaker })}
                  onSuccess={handleSuccess}
                />
              }
            />
            <Route
              path="/users"
              element={
                <UsersSection
                  editing={state.editing.users}
                  token={token}
                  users={state.users}
                  onDelete={handleDelete}
                  onEdit={(backofficeUser) => dispatch({ type: 'EDIT', resource: 'users', payload: backofficeUser })}
                  onSuccess={handleSuccess}
                />
              }
            />
          </Routes>
        )}
      </main>
    </div>
  )
}

const Overview = ({ talks, metrics }) => (
  <>
    <section className="hero-panel">
      <p className="section-kicker">Resumen operativo</p>
      <h1>Control claro de charlas, ponentes e inscripciones.</h1>
      <p>Consulta el estado actual del evento y accede a los mantenimientos principales desde un único panel.</p>
    </section>

    <section className="metrics-grid" aria-label="Métricas principales">
      <MetricCard label="Charlas actuales" value={metrics.currentTalks.length} />
      <MetricCard label="Inscritos históricos" value={metrics.historicalAttendees} />
      <MetricCard label="Charlas realizadas" value={metrics.historicalTalks} />
      <MetricCard label="Charlas totales" value={metrics.totalTalks} />
    </section>

    <section className="dashboard-panel">
      <div className="section-heading">
        <p className="section-kicker">Charlas actuales</p>
        <h2>Próximas sesiones</h2>
      </div>
      <TalksTable talks={metrics.currentTalks.length ? metrics.currentTalks : talks} compact />
    </section>
  </>
)

const MetricCard = ({ label, value }) => (
  <article className="metric-card">
    <span>{label}</span>
    <strong>{value}</strong>
  </article>
)

const TalksTable = ({ talks, compact = false, onEdit, onDelete }) => (
  <div className="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Charla</th>
          <th>Fecha</th>
          <th>Hora</th>
          <th>Ubicación</th>
          <th>Ponentes</th>
          <th>Inscritos</th>
          {!compact ? <th>Acciones</th> : null}
        </tr>
      </thead>
      <tbody>
        {talks.map((talk) => (
          <tr key={talk._id}>
            <td>{talk.title}</td>
            <td>{formatDate(talk.date)}</td>
            <td>{talk.time}</td>
            <td>{locationLabels[talk.location] || talk.location}</td>
            <td>{talk.speakerIds?.map((speaker) => speaker.fullName).join(', ') || 'Sin ponente'}</td>
            <td>{countTalkAttendees(talk)}</td>
            {!compact ? (
              <td className="action-cell">
                <button type="button" onClick={() => onEdit(talk)}>Editar</button>
                <button type="button" className="danger-button" onClick={() => onDelete('talks', talk._id, `la charla ${talk.title}`)}>
                  Eliminar
                </button>
              </td>
            ) : null}
          </tr>
        ))}
      </tbody>
    </table>
    {!talks.length ? <p className="empty-state">No hay registros para mostrar.</p> : null}
  </div>
)

const TalksSection = ({ talks, speakers, editing, token, onSuccess, onEdit, onDelete }) => (
  <section className="entity-layout">
    <TalkForm editing={editing} speakers={speakers} token={token} onSuccess={onSuccess} />
    <div className="dashboard-panel">
      <div className="section-heading"><p className="section-kicker">Mantenimiento</p><h2>Charlas</h2></div>
      <TalksTable talks={talks} onEdit={onEdit} onDelete={onDelete} />
    </div>
  </section>
)

const TalkForm = ({ editing, speakers, token, onSuccess }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()

  useEffect(() => {
    reset({
      title: editing?.title || '',
      description: editing?.description || '',
      date: toInputDate(editing?.date),
      time: editing?.time || '',
      location: editing?.location || 'auditorium',
      speakerIds: getIds(editing?.speakerIds),
      newSpeakerFullName: '',
      newSpeakerPosition: '',
      newSpeakerBio: '',
    })
  }, [editing, reset])

  const onSubmit = async (values) => {
    let speakerIds = Array.isArray(values.speakerIds) ? values.speakerIds : values.speakerIds ? [values.speakerIds] : []

    if (values.newSpeakerFullName || values.newSpeakerPosition || values.newSpeakerBio) {
      const speaker = await createResource('speakers', token, {
        fullName: values.newSpeakerFullName.trim(),
        position: values.newSpeakerPosition.trim(),
        bio: values.newSpeakerBio.trim(),
      })
      speakerIds = [...new Set([...speakerIds, speaker._id])]
    }

    const payload = buildTalkPayload(values, speakerIds)
    if (editing?._id) {
      await updateResource('talks', token, editing._id, payload)
    } else {
      await createResource('talks', token, payload)
    }
    reset()
    await onSuccess('Charla guardada correctamente.')
  }

  return (
    <FormPanel title={editing ? 'Editar charla' : 'Nueva charla'} kicker="Charlas">
      <form className="admin-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field label="Título" error={errors.title?.message}><input {...register('title', { required: 'El título es obligatorio' })} /></Field>
        <Field label="Descripción" error={errors.description?.message}><textarea rows="4" {...register('description', { required: 'La descripción es obligatoria' })} /></Field>
        <div className="form-grid">
          <Field label="Fecha" error={errors.date?.message}><input type="date" {...register('date', { required: 'La fecha es obligatoria' })} /></Field>
          <Field label="Hora" error={errors.time?.message}><input type="time" {...register('time', { required: 'La hora es obligatoria' })} /></Field>
        </div>
        <Field label="Ubicación"><select {...register('location')}><option value="auditorium">Auditorio</option><option value="pressRoom">Sala de prensa</option><option value="emprenbitSpace">Espacio Emprenbit</option></select></Field>
        <Field label="Ponentes existentes"><select multiple {...register('speakerIds')}>{speakers.map((speaker) => <option key={speaker._id} value={speaker._id}>{speaker.fullName}</option>)}</select></Field>
        <div className="inline-create"><p>Alta rápida de ponente</p><input placeholder="Nombre completo" {...register('newSpeakerFullName')} /><input placeholder="Cargo o empresa" {...register('newSpeakerPosition')} /><textarea rows="3" placeholder="Biografía" {...register('newSpeakerBio')} /></div>
        <button className="primary-action" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar charla'}</button>
      </form>
    </FormPanel>
  )
}

const AttendeesSection = ({ attendees, talks, editing, token, onSuccess, onEdit, onDelete }) => (
  <section className="entity-layout">
    <AttendeeForm editing={editing} talks={talks} token={token} onSuccess={onSuccess} />
    <div className="dashboard-panel">
      <div className="section-heading"><p className="section-kicker">Mantenimiento</p><h2>Inscritos</h2></div>
      <CardsGrid items={attendees} renderItem={(attendee) => <AttendeeCard key={attendee._id} attendee={attendee} onEdit={onEdit} onDelete={onDelete} />} />
    </div>
  </section>
)

const AttendeeForm = ({ editing, talks, token, onSuccess }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()

  useEffect(() => {
    reset({ fullName: editing?.fullName || '', email: editing?.email || '', company: editing?.company || '', location: editing?.location || 'mallorca', discoverySource: editing?.discoverySource || 'socialMedia', talkIds: getIds(editing?.talkIds) })
  }, [editing, reset])

  const onSubmit = async (values) => {
    const talkIds = Array.isArray(values.talkIds) ? values.talkIds : values.talkIds ? [values.talkIds] : []
    const payload = { fullName: values.fullName.trim(), email: values.email.trim().toLowerCase(), company: values.company.trim(), location: values.location, discoverySource: values.discoverySource }
    const attendee = editing?._id ? await updateResource('attendees', token, editing._id, payload) : await createResource('attendees', token, payload)
    const attendeeId = attendee._id || editing?._id
    const previousTalkIds = new Set(getIds(editing?.talkIds))
    const nextTalkIds = new Set(talkIds)

    await Promise.all(talkIds.filter((id) => !previousTalkIds.has(id)).map((talkId) => registerAttendeeToTalk(token, attendeeId, talkId)))
    await Promise.all([...previousTalkIds].filter((id) => !nextTalkIds.has(id)).map((talkId) => unregisterAttendeeFromTalk(token, attendeeId, talkId)))
    reset()
    await onSuccess('Inscripción guardada correctamente.')
  }

  return (
    <FormPanel title={editing ? 'Editar inscripción' : 'Nueva inscripción'} kicker="Inscritos">
      <form className="admin-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field label="Nombre completo" error={errors.fullName?.message}><input {...register('fullName', { required: 'El nombre es obligatorio' })} /></Field>
        <Field label="Correo electrónico" error={errors.email?.message}><input type="email" {...register('email', { required: 'El correo es obligatorio' })} /></Field>
        <Field label="Empresa"><input {...register('company')} /></Field>
        <div className="form-grid"><Field label="Isla"><select {...register('location')}><option value="mallorca">Mallorca</option><option value="menorca">Menorca</option><option value="ibiza">Ibiza</option><option value="other">Otro</option></select></Field><Field label="Origen"><select {...register('discoverySource')}><option value="socialMedia">Redes sociales</option><option value="mailing">Mailing</option><option value="wordOfMouth">Boca a boca</option><option value="noneOfTheAbove">Ninguna</option></select></Field></div>
        <Field label="Charlas asociadas"><select multiple {...register('talkIds')}>{talks.map((talk) => <option key={talk._id} value={talk._id}>{talk.title}</option>)}</select></Field>
        <button className="primary-action" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar inscripción'}</button>
      </form>
    </FormPanel>
  )
}

const SpeakersSection = ({ speakers, editing, token, onSuccess, onEdit, onDelete }) => (
  <section className="entity-layout">
    <SpeakerForm editing={editing} token={token} onSuccess={onSuccess} />
    <div className="dashboard-panel"><div className="section-heading"><p className="section-kicker">Mantenimiento</p><h2>Ponentes</h2></div><CardsGrid items={speakers} renderItem={(speaker) => <SpeakerCard key={speaker._id} speaker={speaker} onEdit={onEdit} onDelete={onDelete} />} /></div>
  </section>
)

const SpeakerForm = ({ editing, token, onSuccess }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()
  useEffect(() => { reset({ fullName: editing?.fullName || '', position: editing?.position || '', bio: editing?.bio || '' }) }, [editing, reset])
  const onSubmit = async (values) => {
    const payload = { fullName: values.fullName.trim(), position: values.position.trim(), bio: values.bio.trim() }
    if (editing?._id) await updateResource('speakers', token, editing._id, payload)
    else await createResource('speakers', token, payload)
    reset()
    await onSuccess('Ponente guardado correctamente.')
  }
  return <FormPanel title={editing ? 'Editar ponente' : 'Nuevo ponente'} kicker="Ponentes"><form className="admin-form" onSubmit={handleSubmit(onSubmit)} noValidate><Field label="Nombre completo" error={errors.fullName?.message}><input {...register('fullName', { required: 'El nombre es obligatorio' })} /></Field><Field label="Cargo" error={errors.position?.message}><input {...register('position', { required: 'El cargo es obligatorio' })} /></Field><Field label="Biografía" error={errors.bio?.message}><textarea rows="4" {...register('bio', { required: 'La biografía es obligatoria' })} /></Field><button className="primary-action" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar ponente'}</button></form></FormPanel>
}

const UsersSection = ({ users, editing, token, onSuccess, onEdit, onDelete }) => (
  <section className="entity-layout">
    <UserForm editing={editing} token={token} onSuccess={onSuccess} />
    <div className="dashboard-panel"><div className="section-heading"><p className="section-kicker">Mantenimiento</p><h2>Usuarios backoffice</h2></div><CardsGrid items={users} renderItem={(backofficeUser) => <UserCard key={backofficeUser._id || backofficeUser.id} backofficeUser={backofficeUser} onEdit={onEdit} onDelete={onDelete} />} /></div>
  </section>
)

const UserForm = ({ editing, token, onSuccess }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()
  useEffect(() => { reset({ fullName: editing?.fullName || '', email: editing?.email || '', password: '' }) }, [editing, reset])
  const onSubmit = async (values) => {
    const payload = { fullName: values.fullName.trim(), email: values.email.trim().toLowerCase() }
    if (values.password) payload.password = values.password
    if (editing?._id || editing?.id) await updateResource('users', token, editing._id || editing.id, payload)
    else await createResource('users', token, { ...payload, password: values.password })
    reset()
    await onSuccess('Usuario guardado correctamente.')
  }
  return <FormPanel title={editing ? 'Editar usuario' : 'Nuevo usuario'} kicker="Usuarios"><form className="admin-form" onSubmit={handleSubmit(onSubmit)} noValidate><Field label="Nombre completo" error={errors.fullName?.message}><input {...register('fullName', { required: 'El nombre es obligatorio' })} /></Field><Field label="Correo electrónico" error={errors.email?.message}><input type="email" {...register('email', { required: 'El correo es obligatorio' })} /></Field><Field label={editing ? 'Nueva contraseña' : 'Contraseña'} error={errors.password?.message}><input type="password" autoComplete="new-password" {...register('password', { required: editing ? false : 'La contraseña es obligatoria', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })} /></Field><button className="primary-action" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar usuario'}</button></form></FormPanel>
}

const FormPanel = ({ title, kicker, children }) => <aside className="dashboard-panel form-panel"><p className="section-kicker">{kicker}</p><h2>{title}</h2>{children}</aside>

const Field = ({ label, error, children }) => <label className="field-group"><span>{label}</span>{children}{error ? <small>{error}</small> : null}</label>

const CardsGrid = ({ items, renderItem }) => <div className="cards-grid">{items.length ? items.map(renderItem) : <p className="empty-state">No hay registros para mostrar.</p>}</div>

const AttendeeCard = ({ attendee, onEdit, onDelete }) => <article className="record-card"><h3>{attendee.fullName}</h3><p>{attendee.email}</p><p>{locationLabels[attendee.location]} · {discoveryLabels[attendee.discoverySource]}</p><p>{attendee.talkIds?.length || 0} charlas asociadas</p><div className="card-actions"><button type="button" onClick={() => onEdit(attendee)}>Editar</button><button className="danger-button" type="button" onClick={() => onDelete('attendees', attendee._id, `a ${attendee.fullName}`)}>Eliminar</button></div></article>

const SpeakerCard = ({ speaker, onEdit, onDelete }) => <article className="record-card"><h3>{speaker.fullName}</h3><p>{speaker.position}</p><p>{speaker.bio}</p><div className="card-actions"><button type="button" onClick={() => onEdit(speaker)}>Editar</button><button className="danger-button" type="button" onClick={() => onDelete('speakers', speaker._id, `a ${speaker.fullName}`)}>Eliminar</button></div></article>

const UserCard = ({ backofficeUser, onEdit, onDelete }) => <article className="record-card"><h3>{backofficeUser.fullName}</h3><p>{backofficeUser.email}</p><p>Contraseña protegida</p><div className="card-actions"><button type="button" onClick={() => onEdit(backofficeUser)}>Editar</button><button className="danger-button" type="button" onClick={() => onDelete('users', backofficeUser._id || backofficeUser.id, `a ${backofficeUser.fullName}`)}>Eliminar</button></div></article>

export default Dashboard
