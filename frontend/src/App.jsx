import { startTransition, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const SUPPORTED_LANGUAGES = ['ca', 'es']

const copy = {
  ca: {
    metaTitle: 'Tramuntana Talks | Innovacio des de Mallorca',
    nav: {
      event: 'L\'esdeveniment',
      talks: 'Xerrades',
      editions: 'Edicions anteriors',
      register: 'Inscriu-te',
      menu: 'Obrir menú de navegació',
      closeMenu: 'Tancar menú de navegació',
    },
    languageLabel: 'Canvia idioma',
    hero: {
      eyebrow: '25, 26 i 27 de novembre',
      title: 'Tramuntana Talks: talent, tecnologia i futur amb accent mediterrani.',
      intro:
        'Tres jornades per connectar persones que construeixen producte, cultura digital i empreses amb impacte des de les Illes Balears.',
      primaryCta: 'Veure xerrades',
      secondaryCta: 'Que son?',
      place: 'ParcBit, Palma. Un punt de trobada entre la Serra de Tramuntana i l\'ecosistema tech de Mallorca.',
    },
    stats: [
      ['3 dies', 'de converses i tallers'],
      ['12+ ponents', 'de producte, IA i negoci'],
      ['100% públic', 'inscripcio per xerrada'],
    ],
    about: {
      eyebrow: 'Que son les Tramuntana Talks?',
      title: 'Un forum per pensar la innovacio des d\'una illa que mira al mon.',
      body:
        'Tramuntana Talks reuneix professionals, startups, institucions i comunitat tecnologica per compartir aprenentatges accionables. El format combina ponencies curtes, casos reals i espais de connexio pensats per convertir idees en projectes.',
      locationTitle: 'On passen?',
      locationBody:
        'L\'edicio actual se celebra al ParcBit de Palma, amb sessions a l\'Auditori, la Sala de Premsa i l\'Espai Emprenbit.',
    },
    current: {
      eyebrow: 'Edicio actual',
      title: 'Xerrades de novembre',
      intro: 'Tria la sessio que t\'interessa i registra-t\'hi directament.',
      loading: 'Carregant xerrades...',
      error: 'No hem pogut carregar les xerrades. Torna-ho a provar en uns minuts.',
      empty: 'Encara no hi ha xerrades publicades per aquesta edicio.',
      register: 'Inscriure\'m',
      close: 'Tancar formulari',
      speakerFallback: 'Ponent pendent de confirmar',
      noDescription: 'Descripcio pendent de publicacio.',
    },
    form: {
      title: 'Inscripcio a la xerrada',
      fullName: 'Nom complet',
      email: 'Correu electronic',
      location: 'Illa de residencia',
      company: 'Empresa o projecte',
      discoverySource: 'Com ho has conegut?',
      optional: 'opcional',
      selectPlaceholder: 'Selecciona una opcio',
      submit: 'Enviar inscripcio',
      submitting: 'Enviant...',
      success: 'Inscripcio completada. Ens veim a Tramuntana Talks.',
      requiredName: 'Indica el teu nom complet.',
      requiredEmail: 'Indica el teu correu electronic.',
      invalidEmail: 'Introdueix un correu valid.',
      requiredLocation: 'Selecciona la teva illa.',
      genericError: 'No hem pogut completar la inscripcio. Revisa les dades i torna-ho a provar.',
      alreadyRegistered: 'Aquest correu ja esta inscrit a aquesta xerrada.',
    },
    options: {
      locations: {
        mallorca: 'Mallorca',
        menorca: 'Menorca',
        ibiza: 'Eivissa',
      },
      discoverySources: {
        mailing: 'Email',
        socialMedia: 'RRSS',
        wordOfMouth: 'Amic o amiga',
        noneOfTheAbove: 'Altres',
      },
      talkLocations: {
        auditorium: 'Auditori ParcBit',
        pressRoom: 'Sala de Premsa',
        emprenbitSpace: 'Espai Emprenbit',
      },
    },
    previous: {
      eyebrow: 'Memoria viva',
      title: 'Edicions anteriors',
      intro: 'Contingut estatic provisional amb una mostra realista de la comunitat Tramuntana Talks.',
    },
    footer: {
      text: 'Tramuntana Talks connecta coneixement local i ambicio global des de Mallorca.',
      back: 'Torna a l\'inici',
    },
  },
  es: {
    metaTitle: 'Tramuntana Talks | Innovacion desde Mallorca',
    nav: {
      event: 'El evento',
      talks: 'Charlas',
      editions: 'Ediciones anteriores',
      register: 'Inscribete',
      menu: 'Abrir menú de navegación',
      closeMenu: 'Cerrar menú de navegación',
    },
    languageLabel: 'Cambiar idioma',
    hero: {
      eyebrow: '25, 26 y 27 de noviembre',
      title: 'Tramuntana Talks: talento, tecnologia y futuro con acento mediterraneo.',
      intro:
        'Tres jornadas para conectar a personas que construyen producto, cultura digital y empresas con impacto desde las Islas Baleares.',
      primaryCta: 'Ver charlas',
      secondaryCta: 'Que son?',
      place: 'ParcBit, Palma. Un punto de encuentro entre la Serra de Tramuntana y el ecosistema tech de Mallorca.',
    },
    stats: [
      ['3 dias', 'de conversaciones y talleres'],
      ['12+ ponentes', 'de producto, IA y negocio'],
      ['100% publico', 'inscripcion por charla'],
    ],
    about: {
      eyebrow: 'Que son las Tramuntana Talks?',
      title: 'Un foro para pensar la innovacion desde una isla que mira al mundo.',
      body:
        'Tramuntana Talks reune a profesionales, startups, instituciones y comunidad tecnologica para compartir aprendizajes accionables. El formato combina ponencias cortas, casos reales y espacios de conexion pensados para convertir ideas en proyectos.',
      locationTitle: 'Donde suceden?',
      locationBody:
        'La edicion actual se celebra en ParcBit, Palma, con sesiones en el Auditorio, la Sala de Prensa y el Espacio Emprenbit.',
    },
    current: {
      eyebrow: 'Edicion actual',
      title: 'Charlas de noviembre',
      intro: 'Elige la sesion que te interesa e inscribete directamente.',
      loading: 'Cargando charlas...',
      error: 'No hemos podido cargar las charlas. Vuelve a intentarlo en unos minutos.',
      empty: 'Aun no hay charlas publicadas para esta edicion.',
      register: 'Inscribirme',
      close: 'Cerrar formulario',
      speakerFallback: 'Ponente pendiente de confirmar',
      noDescription: 'Descripcion pendiente de publicacion.',
    },
    form: {
      title: 'Inscripcion a la charla',
      fullName: 'Nombre completo',
      email: 'Correo electronico',
      location: 'Isla de residencia',
      company: 'Empresa o proyecto',
      discoverySource: 'Como lo has conocido?',
      optional: 'opcional',
      selectPlaceholder: 'Selecciona una opcion',
      submit: 'Enviar inscripcion',
      submitting: 'Enviando...',
      success: 'Inscripcion completada. Nos vemos en Tramuntana Talks.',
      requiredName: 'Indica tu nombre completo.',
      requiredEmail: 'Indica tu correo electronico.',
      invalidEmail: 'Introduce un correo valido.',
      requiredLocation: 'Selecciona tu isla.',
      genericError: 'No hemos podido completar la inscripcion. Revisa los datos y vuelve a intentarlo.',
      alreadyRegistered: 'Este correo ya esta inscrito a esta charla.',
    },
    options: {
      locations: {
        mallorca: 'Mallorca',
        menorca: 'Menorca',
        ibiza: 'Ibiza',
      },
      discoverySources: {
        mailing: 'Email',
        socialMedia: 'RRSS',
        wordOfMouth: 'Amigo o amiga',
        noneOfTheAbove: 'Otros',
      },
      talkLocations: {
        auditorium: 'Auditorio ParcBit',
        pressRoom: 'Sala de Prensa',
        emprenbitSpace: 'Espacio Emprenbit',
      },
    },
    previous: {
      eyebrow: 'Memoria viva',
      title: 'Ediciones anteriores',
      intro: 'Contenido estatico provisional con una muestra realista de la comunidad Tramuntana Talks.',
    },
    footer: {
      text: 'Tramuntana Talks conecta conocimiento local y ambicion global desde Mallorca.',
      back: 'Volver al inicio',
    },
  },
}

const previousEditions = {
  ca: [
    {
      year: '2024',
      talks: [
        {
          speaker: 'Marta Serra',
          bio: 'Directora de producte a una scaleup de traveltech nascuda a Palma.',
          title: 'Producte global des d\'una illa',
          description:
            'Com validar mercats internacionals sense perdre la proximitat amb l\'usuari local.',
        },
        {
          speaker: 'Joan Pons',
          bio: 'Investigador en IA aplicada a sostenibilitat i dades obertes.',
          title: 'IA per cuidar el territori',
          description:
            'Casos d\'us de models predictius per anticipar pressio turistica i consum energetic.',
        },
      ],
    },
    {
      year: '2023',
      talks: [
        {
          speaker: 'Clara Bennasar',
          bio: 'Fundadora d\'un estudi de disseny civic i serveis digitals.',
          title: 'Dissenyar serveis publics que la gent vol usar',
          description:
            'Aprenentatges de recerca amb ciutadania, prototipat rapid i accessibilitat real.',
        },
        {
          speaker: 'Luis Marquez',
          bio: 'CTO especialitzat en plataformes SaaS per a pimes mediterranies.',
          title: 'Arquitectures petites, impacte gran',
          description:
            'Decisions tecniques pragmatiques per escalar equips sense sobreenginyeria.',
        },
      ],
    },
  ],
  es: [
    {
      year: '2024',
      talks: [
        {
          speaker: 'Marta Serra',
          bio: 'Directora de producto en una scaleup de traveltech nacida en Palma.',
          title: 'Producto global desde una isla',
          description:
            'Como validar mercados internacionales sin perder la cercania con el usuario local.',
        },
        {
          speaker: 'Joan Pons',
          bio: 'Investigador en IA aplicada a sostenibilidad y datos abiertos.',
          title: 'IA para cuidar el territorio',
          description:
            'Casos de uso de modelos predictivos para anticipar presion turistica y consumo energetico.',
        },
      ],
    },
    {
      year: '2023',
      talks: [
        {
          speaker: 'Clara Bennasar',
          bio: 'Fundadora de un estudio de diseno civico y servicios digitales.',
          title: 'Disenar servicios publicos que la gente quiere usar',
          description:
            'Aprendizajes de investigacion con ciudadania, prototipado rapido y accesibilidad real.',
        },
        {
          speaker: 'Luis Marquez',
          bio: 'CTO especializado en plataformas SaaS para pymes mediterraneas.',
          title: 'Arquitecturas pequenas, impacto grande',
          description:
            'Decisiones tecnicas pragmaticas para escalar equipos sin sobreingenieria.',
        },
      ],
    },
  ],
}

const locationOptions = ['mallorca', 'menorca', 'ibiza']
const discoveryOptions = ['mailing', 'socialMedia', 'wordOfMouth', 'noneOfTheAbove']

const getInitialLanguage = () => {
  const storedLanguage = window.localStorage.getItem('tramuntana-language')
  return SUPPORTED_LANGUAGES.includes(storedLanguage) ? storedLanguage : 'ca'
}

const formatTalkDate = (date, language) => {
  if (!date) return ''

  const parsedDate = new Date(date)
  if (Number.isNaN(parsedDate.getTime())) return ''

  return new Intl.DateTimeFormat(language === 'ca' ? 'ca-ES' : 'es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  }).format(parsedDate)
}

const getStatusMessage = (status, dictionary) => {
  if (!status) return ''
  if (status.type === 'success') return dictionary.form.success
  return status.message || dictionary.form.genericError
}

function RegistrationForm({ dictionary, onSubmit, status }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      location: '',
      company: '',
      discoverySource: '',
    },
  })

  const handleFormSubmit = async (values) => {
    const wasSuccessful = await onSubmit(values)
    if (wasSuccessful) reset()
  }

  const statusMessage = getStatusMessage(status, dictionary)

  return (
    <form className="registration-form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <h4>{dictionary.form.title}</h4>

      <div className="form-grid">
        <label>
          <span>{dictionary.form.fullName}</span>
          <input
            type="text"
            autoComplete="name"
            {...register('fullName', { required: dictionary.form.requiredName })}
          />
          {errors.fullName ? <small role="alert">{errors.fullName.message}</small> : null}
        </label>

        <label>
          <span>{dictionary.form.email}</span>
          <input
            type="email"
            autoComplete="email"
            {...register('email', {
              required: dictionary.form.requiredEmail,
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: dictionary.form.invalidEmail,
              },
            })}
          />
          {errors.email ? <small role="alert">{errors.email.message}</small> : null}
        </label>

        <label>
          <span>{dictionary.form.location}</span>
          <select {...register('location', { required: dictionary.form.requiredLocation })}>
            <option value="">{dictionary.form.selectPlaceholder}</option>
            {locationOptions.map((location) => (
              <option value={location} key={location}>
                {dictionary.options.locations[location]}
              </option>
            ))}
          </select>
          {errors.location ? <small role="alert">{errors.location.message}</small> : null}
        </label>

        <label>
          <span>
            {dictionary.form.company} <em>{dictionary.form.optional}</em>
          </span>
          <input type="text" autoComplete="organization" {...register('company')} />
        </label>

        <label className="form-grid-wide">
          <span>
            {dictionary.form.discoverySource} <em>{dictionary.form.optional}</em>
          </span>
          <select {...register('discoverySource')}>
            <option value="">{dictionary.form.selectPlaceholder}</option>
            {discoveryOptions.map((source) => (
              <option value={source} key={source}>
                {dictionary.options.discoverySources[source]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button className="button button-primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? dictionary.form.submitting : dictionary.form.submit}
      </button>

      <p
        className={`form-status ${status?.type === 'success' ? 'form-status-success' : ''}`}
        aria-live="polite"
      >
        {statusMessage}
      </p>
    </form>
  )
}

function TalkCard({ talk, dictionary, language, isActive, status, onToggleRegister, onRegister }) {
  const speakers = Array.isArray(talk.speakers) ? talk.speakers : []
  const speakerNames = speakers.map((speaker) => speaker.fullName).filter(Boolean).join(', ')
  const firstSpeakerPhoto = speakers.find((speaker) => speaker.photoUrl)?.photoUrl
  const formattedDate = formatTalkDate(talk.date, language)
  const location = dictionary.options.talkLocations[talk.location] || talk.location

  return (
    <article className="talk-card">
      <div className="talk-media" aria-hidden={!firstSpeakerPhoto}>
        {firstSpeakerPhoto ? (
          <img src={firstSpeakerPhoto} alt="" loading="lazy" />
        ) : (
          <span>{speakerNames || dictionary.current.speakerFallback}</span>
        )}
      </div>

      <div className="talk-content">
        <div className="talk-meta">
          <span>{formattedDate}</span>
          <span>{talk.time}</span>
          <span>{location}</span>
        </div>

        <h3>{talk.title}</h3>
        <p>{talk.description || dictionary.current.noDescription}</p>

        <div className="speaker-list">
          {speakers.length > 0 ? (
            speakers.map((speaker) => (
              <div className="speaker-pill" key={speaker._id || speaker.fullName}>
                <strong>{speaker.fullName}</strong>
                {speaker.position ? <span>{speaker.position}</span> : null}
              </div>
            ))
          ) : (
            <div className="speaker-pill">
              <strong>{dictionary.current.speakerFallback}</strong>
            </div>
          )}
        </div>

        <button className="button button-outline" type="button" onClick={onToggleRegister}>
          {isActive ? dictionary.current.close : dictionary.current.register}
        </button>

        {isActive ? <RegistrationForm dictionary={dictionary} onSubmit={onRegister} status={status} /> : null}
      </div>
    </article>
  )
}

function PreviousEditions({ dictionary, editions }) {
  return (
    <section className="section previous-section" id="previous-editions" aria-labelledby="previous-title">
      <div className="section-heading">
        <p className="eyebrow">{dictionary.previous.eyebrow}</p>
        <h2 id="previous-title">{dictionary.previous.title}</h2>
        <p>{dictionary.previous.intro}</p>
      </div>

      <div className="edition-grid">
        {editions.map((edition) => (
          <article className="edition-card" key={edition.year}>
            <div className="edition-year">{edition.year}</div>
            {edition.talks.map((talk) => (
              <div className="previous-talk" key={`${edition.year}-${talk.title}`}>
                <h3>{talk.title}</h3>
                <p>{talk.description}</p>
                <div>
                  <strong>{talk.speaker}</strong>
                  <span>{talk.bio}</span>
                </div>
              </div>
            ))}
          </article>
        ))}
      </div>
    </section>
  )
}

function App() {
  const [language, setLanguage] = useState(getInitialLanguage)
  const [talks, setTalks] = useState([])
  const [isLoadingTalks, setIsLoadingTalks] = useState(true)
  const [talksError, setTalksError] = useState('')
  const [activeTalkId, setActiveTalkId] = useState('')
  const [registrationStatus, setRegistrationStatus] = useState({})
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const dictionary = copy[language]
  const talksErrorMessage = dictionary.current.error

  useEffect(() => {
    document.documentElement.lang = language
    document.title = dictionary.metaTitle
    window.localStorage.setItem('tramuntana-language', language)
  }, [dictionary.metaTitle, language])

  useEffect(() => {
    const controller = new AbortController()

    const loadTalks = async () => {
      setIsLoadingTalks(true)
      setTalksError('')

      try {
        const response = await fetch(`${API_BASE_URL}/api/public/talks?lang=${language}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Talks request failed with status ${response.status}`)
        }

        const data = await response.json()
        setTalks(Array.isArray(data) ? data : [])
      } catch (error) {
        if (error.name !== 'AbortError') {
          setTalksError(talksErrorMessage)
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingTalks(false)
        }
      }
    }

    loadTalks()

    return () => controller.abort()
  }, [language, talksErrorMessage])

  const handleLanguageChange = (nextLanguage) => {
    if (nextLanguage === language) return

    startTransition(() => {
      setLanguage(nextLanguage)
      setActiveTalkId('')
      setIsMenuOpen(false)
    })
  }

  const handleToggleMenu = () => {
    setIsMenuOpen((currentValue) => !currentValue)
  }

  const handleCloseMenu = () => {
    setIsMenuOpen(false)
  }

  const handleToggleRegister = (talkId) => {
    setActiveTalkId((currentTalkId) => (currentTalkId === talkId ? '' : talkId))
  }

  const handleRegister = async (talkId, values) => {
    setRegistrationStatus((currentStatus) => ({
      ...currentStatus,
      [talkId]: { type: 'loading', message: dictionary.form.submitting },
    }))

    try {
      const response = await fetch(`${API_BASE_URL}/api/public/talks/${talkId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: values.fullName.trim(),
          email: values.email.trim().toLowerCase(),
          location: values.location,
          company: values.company.trim(),
          discoverySource: values.discoverySource || 'noneOfTheAbove',
        }),
      })

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}))
        const message =
          errorBody.message === 'Already registered for this talk'
            ? dictionary.form.alreadyRegistered
            : dictionary.form.genericError
        throw new Error(message)
      }

      setRegistrationStatus((currentStatus) => ({
        ...currentStatus,
        [talkId]: { type: 'success', message: dictionary.form.success },
      }))
      return true
    } catch (error) {
      setRegistrationStatus((currentStatus) => ({
        ...currentStatus,
        [talkId]: { type: 'error', message: error.message || dictionary.form.genericError },
      }))
      return false
    }
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Tramuntana Talks">
          <img className="brand-logo" src="/logo-emprenbit-transparente.png" alt="Emprenbit" />
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label={isMenuOpen ? dictionary.nav.closeMenu : dictionary.nav.menu}
          aria-controls="site-navigation"
          aria-expanded={isMenuOpen}
          onClick={handleToggleMenu}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>

        <div className={`header-actions${isMenuOpen ? ' is-open' : ''}`} id="site-navigation">
          <nav className="main-nav" aria-label="Main navigation">
            <a href="#event" onClick={handleCloseMenu}>{dictionary.nav.event}</a>
            <a href="#talks" onClick={handleCloseMenu}>{dictionary.nav.talks}</a>
            <a href="#previous-editions" onClick={handleCloseMenu}>{dictionary.nav.editions}</a>
          </nav>

          <div className="language-toggle" aria-label={dictionary.languageLabel}>
            {SUPPORTED_LANGUAGES.map((supportedLanguage) => (
              <button
                type="button"
                key={supportedLanguage}
                className={supportedLanguage === language ? 'is-active' : ''}
                aria-pressed={supportedLanguage === language}
                onClick={() => handleLanguageChange(supportedLanguage)}
              >
                {supportedLanguage.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">{dictionary.hero.eyebrow}</p>
            <h1 id="hero-title">{dictionary.hero.title}</h1>
            <p className="hero-intro">{dictionary.hero.intro}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#talks">
                {dictionary.hero.primaryCta}
              </a>
              <a className="button button-secondary" href="#event">
                {dictionary.hero.secondaryCta}
              </a>
            </div>
            <p className="hero-place">{dictionary.hero.place}</p>
          </div>

          <div className="mountain-stage" aria-hidden="true">
            <div className="sun-orb"></div>
            <div className="topographic-lines"></div>
            <div className="mountain mountain-back"></div>
            <div className="mountain mountain-front"></div>
          </div>
        </section>

        <section className="stats-strip" aria-label="Tramuntana Talks highlights">
          {dictionary.stats.map(([value, label]) => (
            <div key={value}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </section>

        <section className="section about-section" id="event" aria-labelledby="about-title">
          <div className="section-heading">
            <p className="eyebrow">{dictionary.about.eyebrow}</p>
            <h2 id="about-title">{dictionary.about.title}</h2>
          </div>
          <div className="about-card">
            <p>{dictionary.about.body}</p>
            <div>
              <h3>{dictionary.about.locationTitle}</h3>
              <p>{dictionary.about.locationBody}</p>
            </div>
          </div>
        </section>

        <section className="section talks-section" id="talks" aria-labelledby="talks-title">
          <div className="section-heading">
            <p className="eyebrow">{dictionary.current.eyebrow}</p>
            <h2 id="talks-title">{dictionary.current.title}</h2>
            <p>{dictionary.current.intro}</p>
          </div>

          <div className="talks-feedback" aria-live="polite">
            {isLoadingTalks ? dictionary.current.loading : null}
            {!isLoadingTalks && talksError ? talksError : null}
            {!isLoadingTalks && !talksError && talks.length === 0 ? dictionary.current.empty : null}
          </div>

          {!isLoadingTalks && !talksError && talks.length > 0 ? (
            <div className="talk-list">
              {talks.map((talk) => (
                <TalkCard
                  key={talk._id}
                  talk={talk}
                  dictionary={dictionary}
                  language={language}
                  isActive={activeTalkId === talk._id}
                  status={registrationStatus[talk._id]}
                  onToggleRegister={() => handleToggleRegister(talk._id)}
                  onRegister={(values) => handleRegister(talk._id, values)}
                />
              ))}
            </div>
          ) : null}
        </section>

        <PreviousEditions dictionary={dictionary} editions={previousEditions[language]} />
      </main>

      <footer className="site-footer">
        <p>{dictionary.footer.text}</p>
        <a href="#top">{dictionary.footer.back}</a>
      </footer>
    </div>
  )
}

export default App
