// Cartas del juego: 24 por etapa (alcanza para 6 personas × 4 vueltas sin repetir).
// Desde la etapa 3 las preguntas son más profundas. Al final, las cartas de cierre.

export type Tipo = "pensar" | "sentir" | "accionar";

/** Comodines: cambian quién responde la pregunta de la carta.
 *  elegir: quien saca la carta se la regala a quien elija · todos: responden todos
 *  derecha / izquierda: se la regala al jugador de al lado */
export type Comodin = "elegir" | "todos" | "derecha" | "izquierda";

export const NOMBRE_COMODIN: Record<Comodin, string> = {
  elegir: "Comodín · Regalala a quien elijas",
  todos: "Comodín · Pregunta para todos",
  derecha: "Regalo para tu derecha",
  izquierda: "Regalo para tu izquierda",
};

export interface Carta {
  id: string;
  etapa: number; // 0..4
  tipo: Tipo;
  texto: string;
  comodin?: Comodin; // cartas marcadas: 4 por nivel, una de cada comodín
}

export interface Etapa {
  nombre: string;
  bajada: string;
  color: string; // luz de la etapa
}

export const ETAPAS: Etapa[] = [
  { nombre: "Conocernos", bajada: "Romper el hielo, descubrir afinidades, generar confianza.", color: "#e8b86a" },
  { nombre: "Descubrirnos", bajada: "Identidad, creencias, valores y formas de vivir.", color: "#7fb7a4" },
  { nombre: "Sentirnos", bajada: "Emociones, vínculos, heridas, miedos y necesidades.", color: "#d98a8a" },
  { nombre: "Reconocernos", bajada: "Historia personal, aprendizajes, aceptación.", color: "#9a8fd1" },
  { nombre: "Transformarnos", bajada: "Decisiones, posibilidades y nuevos comienzos.", color: "#e39a5e" },
];

export const TIPOS: Record<Tipo, { nombre: string; signo: string }> = {
  pensar: { nombre: "Para pensar", signo: "◯" },
  sentir: { nombre: "Para sentir", signo: "♡" },
  accionar: { nombre: "Para accionar", signo: "→" },
};

const c = (etapa: number, tipo: Tipo, texto: string, n: number): Carta => ({ id: `${etapa}-${n}`, etapa, tipo, texto });

/** Cartas marcadas como comodín o regalo: una de cada tipo en cada nivel */
const COMODINES_FIJOS: Record<string, Comodin> = {
  "0-1": "elegir", "0-12": "todos", "0-14": "derecha", "0-10": "izquierda",
  "1-3": "elegir", "1-22": "todos", "1-7": "derecha", "1-4": "izquierda",
  "2-1": "elegir", "2-19": "todos", "2-12": "derecha", "2-16": "izquierda",
  "3-11": "elegir", "3-20": "todos", "3-18": "derecha", "3-10": "izquierda",
  "4-1": "elegir", "4-21": "todos", "4-12": "derecha", "4-11": "izquierda",
};

const BASE: Carta[] = [
  // ---------- 1 · Conocernos ----------
  c(0, "pensar", "¿Qué es algo de vos que pocas personas conocen?", 1),
  c(0, "pensar", "¿Qué hacías de chico o chica que todavía te hace sonreír cuando lo recordás?", 2),
  c(0, "pensar", "Si tuvieras que presentarte sin decir a qué te dedicás, ¿qué dirías?", 3),
  c(0, "sentir", "Mirá a las demás personas por un momento. ¿Con quién sentís que podrías tener algo en común? Contale por qué.", 4),
  c(0, "sentir", "Contá un lugar donde te sentís en casa, y qué lo hace especial.", 5),
  c(0, "accionar", "Compartí una canción, una frase o un objeto cercano que hable de vos, y explicá por qué.", 6),
  c(0, "pensar", "¿Qué te gusta hacer cuando nadie te está mirando?", 7),
  c(0, "pensar", "¿Cuál es el mejor consejo que te dieron, y quién te lo dio?", 8),
  c(0, "pensar", "Si tu vida fuera una película, ¿cómo se llamaría esta etapa?", 9),
  c(0, "sentir", "¿Qué pequeño momento de esta semana te hizo bien?", 10),
  c(0, "sentir", "¿Qué te sorprendió de alguien de esta mesa en estos primeros minutos?", 11),
  c(0, "accionar", "Contá en tres palabras cómo llegás hoy a este encuentro.", 12),
  c(0, "pensar", "¿Qué es lo que más disfrutás de un día común?", 13),
  c(0, "pensar", "¿Qué te hace reír aunque no quieras?", 14),
  c(0, "sentir", "¿Qué comida te transporta a otro momento de tu vida, y qué sentís al recordarlo?", 15),
  c(0, "pensar", "Si pudieras vivir un año en otro lugar del mundo, ¿dónde sería y por qué?", 16),
  c(0, "accionar", "Mostrá o contá un talento tuyo que casi nadie conoce.", 17),
  c(0, "pensar", "¿Qué te gustaba ser de grande cuando eras chico o chica?", 18),
  c(0, "sentir", "¿Qué te trae calma cuando el día se pone pesado?", 19),
  c(0, "sentir", "¿Quién fue la última persona que te hizo sentir bien con un gesto simple?", 20),
  c(0, "sentir", "¿Qué estación del año se parece más a cómo estás hoy?", 21),
  c(0, "accionar", "Elegí a alguien de la mesa y hacele una pregunta que te dé curiosidad sobre su vida.", 22),
  c(0, "accionar", "Contá algo que te pasó esta semana y que todavía te hace sonreír.", 23),
  c(0, "accionar", "Mostrá algo que tengas cerca y que te acompañe hace muchos años, y contá su historia.", 24),

  // ---------- 2 · Descubrirnos ----------
  c(1, "pensar", "¿Cuánto de lo que sos elegiste, y cuánto aprendiste a ser?", 1),
  c(1, "pensar", "¿Qué creencia de tu familia seguís sosteniendo, y cuál dejaste atrás?", 2),
  c(1, "pensar", "¿Qué valor no negociarías aunque te costara caro?", 3),
  c(1, "sentir", "¿En qué momento de tu vida sentiste que eras más vos?", 4),
  c(1, "sentir", "Elegí a alguien del grupo y decile qué creés que valora en la vida, por lo que escuchaste hasta ahora.", 5),
  c(1, "accionar", "Nombrá algo que hacés solo porque se espera de vos. ¿Qué pasaría si dejaras de hacerlo?", 6),
  c(1, "pensar", "¿Qué es para vos una vida bien vivida?", 7),
  c(1, "pensar", "¿En qué cambiaste de opinión en los últimos años?", 8),
  c(1, "pensar", "¿Qué te enoja del mundo, y qué dice eso de lo que te importa?", 9),
  c(1, "sentir", "¿Con qué persona de tu vida te sentís más libre de ser como sos?", 10),
  c(1, "sentir", "¿Qué parte de tu cultura o de tu origen llevás con orgullo?", 11),
  c(1, "accionar", "Nombrá algo que te gustaría aprender, y contá qué te frena.", 12),
  c(1, "pensar", "¿Qué es el éxito para vos, y en qué se diferencia de lo que te enseñaron?", 13),
  c(1, "pensar", "¿Qué te gustaría que se dijera de vos en tu barrio o en tu trabajo?", 14),
  c(1, "accionar", "Contá con un ejemplo qué rol ocupás casi siempre en un grupo: el que organiza, el que escucha, el que hace reír…", 15),
  c(1, "sentir", "¿Qué frase de tu familia se te viene a la cabeza en los momentos difíciles, y cómo te hace sentir?", 16),
  c(1, "pensar", "¿En qué creés hoy que antes no creías?", 17),
  c(1, "pensar", "¿Qué tiene que tener alguien para que confíes en esa persona?", 18),
  c(1, "sentir", "¿Qué te hace sentir orgulloso u orgullosa de cómo vivís?", 19),
  c(1, "sentir", "¿En qué lugar o actividad te sentís en paz con quien sos?", 20),
  c(1, "sentir", "¿Qué persona te inspira, y qué de ella te gustaría tener?", 21),
  c(1, "accionar", "Nombrá tres palabras que te definen hoy, y una que te gustaría que te definiera.", 22),
  c(1, "accionar", "Contá una decisión que tomaste contra la corriente y que hoy volverías a tomar.", 23),
  c(1, "accionar", "Elegí a alguien de la mesa y decile qué valor creés que lo guía, por lo que viste de él o de ella hoy.", 24),

  // ---------- 3 · Sentirnos (más profundo) ----------
  c(2, "pensar", "¿Qué emoción aprendiste de chico o chica que no estaba permitido sentir en tu casa?", 1),
  c(2, "pensar", "¿Qué herida sigue doliendo aunque digas que ya la superaste?", 2),
  c(2, "pensar", "¿De qué tenés miedo que se enteren los demás si te muestran tal cual sos?", 3),
  c(2, "pensar", "¿Qué necesitaste de tu madre o de tu padre y nunca recibiste?", 4),
  c(2, "pensar", "¿En qué relación das más de lo que recibís, y por qué la seguís sosteniendo?", 5),
  c(2, "pensar", "¿Qué parte de vos se pone a la defensiva cuando alguien se acerca demasiado?", 6),
  c(2, "pensar", "¿Cuál es la soledad que más te pesa: la de estar sin gente o la de estar acompañado y no sentirte visto?", 7),
  c(2, "pensar", "¿Qué te da vergüenza sentir?", 8),
  c(2, "pensar", "¿A quién todavía no le perdonaste algo, y qué te cuesta soltar de eso?", 9),
  c(2, "pensar", "¿Qué pérdida no terminaste de llorar?", 10),
  c(2, "sentir", "¿Cuándo fue la última vez que lloraste de verdad, y qué se movió en vos?", 11),
  c(2, "sentir", "¿Qué te da miedo perder, y qué harías si lo perdieras?", 12),
  c(2, "sentir", "Contá un momento en que te sentiste profundamente solo o sola, aun rodeado de gente.", 13),
  c(2, "sentir", "¿Qué enojo estás guardando, y contra quién?", 14),
  c(2, "sentir", "¿Qué abrazo te debe la vida?", 15),
  c(2, "sentir", "¿A quién extrañás hoy, aunque no lo digas?", 16),
  c(2, "sentir", "¿Qué te hace sentir que no sos suficiente?", 17),
  c(2, "sentir", "¿En qué momento te sentiste traicionado o traicionada, y qué te dejó esa experiencia?", 18),
  c(2, "accionar", "Cerrá los ojos unos segundos. Nombrá en voz alta la emoción que estás evitando sentir en este momento de tu vida.", 19),
  c(2, "accionar", "Decile a alguien de esta mesa algo que te movió de lo que compartió, aunque te cueste.", 20),
  c(2, "accionar", "Completá en voz alta: «Lo que nunca me animé a decir es…».", 21),
  c(2, "accionar", "Pedile al grupo lo que necesitás ahora mismo: silencio, una palabra, una mirada.", 22),
  c(2, "accionar", "Poné una mano en el lugar del cuerpo donde sentís el dolor más viejo, y contá qué guarda.", 23),
  c(2, "accionar", "Nombrá a alguien a quien le debés una disculpa, y decí qué le dirías.", 24),

  // ---------- 4 · Reconocernos (más profundo) ----------
  c(3, "pensar", "¿Qué repetís de tu madre o de tu padre que juraste que nunca ibas a repetir?", 1),
  c(3, "pensar", "¿Qué mentira te contaste durante años para no ver algo?", 2),
  c(3, "pensar", "¿Qué decisión de tu pasado todavía te pesa, y qué aprendiste de ella?", 3),
  c(3, "pensar", "¿Qué lugar ocupaste en tu familia para que todo funcionara: el fuerte, el invisible, el que cuida, el problema?", 4),
  c(3, "pensar", "¿Qué secreto familiar sentís que todavía te toca de alguna manera?", 5),
  c(3, "pensar", "¿De qué te hacés cargo hoy que antes culpabas a otros?", 6),
  c(3, "pensar", "¿Qué parte de tu historia te avergüenza, y qué te enseñó?", 7),
  c(3, "pensar", "¿A quién lastimaste sin darte cuenta, y cuándo lo entendiste?", 8),
  c(3, "pensar", "¿Qué patrón se repite en tus relaciones de pareja o de amistad?", 9),
  c(3, "pensar", "¿Qué te costó aceptar de vos que hoy empezás a mirar con ternura?", 10),
  c(3, "sentir", "¿Qué le dirías hoy a la persona que eras en el momento más difícil de tu vida?", 11),
  c(3, "sentir", "¿A quién de tu familia necesitás agradecerle algo que nunca le agradeciste?", 12),
  c(3, "sentir", "¿Qué parte de tu niñez necesita todavía ser abrazada?", 13),
  c(3, "sentir", "¿Con qué ancestro o persona de tu historia sentís un lazo fuerte, aunque no la hayas conocido?", 14),
  c(3, "sentir", "¿Qué dolor heredaste que no era tuyo?", 15),
  c(3, "sentir", "¿Qué te perdonaste a vos, y qué todavía no?", 16),
  c(3, "sentir", "¿Quién estuvo cuando más lo necesitabas, y sabe lo que significó para vos?", 17),
  c(3, "sentir", "¿Qué fuerza descubriste en vos en tu peor momento?", 18),
  c(3, "accionar", "Contá un logro tuyo que nunca celebraste, y celebralo ahora con el grupo.", 19),
  c(3, "accionar", "Completá en voz alta: «Me hago cargo de…».", 20),
  c(3, "accionar", "Nombrá a alguien de tu historia a quien hoy le devolvés lo que no era tuyo cargar, y decile «esto es tuyo».", 21),
  c(3, "accionar", "Decí en voz alta una frase de reconciliación con tu historia, empezando por «Acepto que…».", 22),
  c(3, "accionar", "Mirá a alguien del grupo y contale algo de tu historia que nunca le contaste a nadie, si te animás.", 23),
  c(3, "accionar", "Nombrá a tu padre y a tu madre, y decí una cosa que tomás de cada uno con gratitud.", 24),

  // ---------- 5 · Transformarnos (más profundo) ----------
  c(4, "pensar", "Si dejaras de tener miedo, ¿qué empezarías a hacer mañana mismo?", 1),
  c(4, "pensar", "¿Qué vida estás viviendo por obligación, y cuál querés vivir de verdad?", 2),
  c(4, "pensar", "¿Qué tendrías que soltar para ser feliz, aunque hoy te dé seguridad?", 3),
  c(4, "pensar", "¿Qué conversación pendiente te liberaría si la tuvieras?", 4),
  c(4, "pensar", "¿A qué le estás diciendo que sí cuando en realidad querés decir que no?", 5),
  c(4, "pensar", "Si te quedara un año de vida, ¿qué cambiarías hoy?", 6),
  c(4, "pensar", "¿Qué te dice tu intuición desde hace tiempo y todavía no escuchaste?", 7),
  c(4, "pensar", "¿Qué precio estás pagando por no cambiar?", 8),
  c(4, "pensar", "¿Qué relación necesitás cerrar, cambiar o recuperar?", 9),
  c(4, "pensar", "¿Quién serías si nadie esperara nada de vos?", 10),
  c(4, "sentir", "¿Qué estás listo o lista para soltar hoy, en esta mesa?", 11),
  c(4, "sentir", "¿Qué sueño abandonaste y todavía te llama?", 12),
  c(4, "sentir", "¿Qué te da miedo de cambiar: perder, fracasar o que te vaya bien?", 13),
  c(4, "sentir", "Decile a alguien del grupo qué posibilidad ves en él o en ella que quizás no ve.", 14),
  c(4, "sentir", "¿Qué querés que la gente recuerde de vos cuando ya no estés?", 15),
  c(4, "sentir", "¿Qué parte de vos está naciendo y necesita espacio?", 16),
  c(4, "sentir", "¿Qué te estás negando a recibir: amor, ayuda, descanso, reconocimiento?", 17),
  c(4, "sentir", "Imaginate dentro de cinco años, en paz. ¿Qué te agradecería esa persona que vas a ser?", 18),
  c(4, "accionar", "Nombrá una decisión que estás postergando, poné una fecha y decila en voz alta.", 19),
  c(4, "accionar", "Comprometete a un primer paso pequeño para esta semana, y pedile a alguien de la mesa que te lo recuerde.", 20),
  c(4, "accionar", "Decí en voz alta: «A partir de hoy dejo de…» y «A partir de hoy empiezo a…».", 21),
  c(4, "accionar", "Pedile a alguien del grupo que te acompañe en algo que querés empezar.", 22),
  c(4, "accionar", "Escribí o decí una frase que te quieras regalar para lo que viene.", 23),
  c(4, "accionar", "Elegí a una persona de tu vida a quien vas a llamar o escribir esta semana, y contá qué le vas a decir.", 24),
];

export const CARTAS: Carta[] = BASE.map((carta) => (COMODINES_FIJOS[carta.id] ? { ...carta, comodin: COMODINES_FIJOS[carta.id] } : carta));

/** Cierre ritual: una por persona, para salir del juego con cuidado */
export const CIERRES: string[] = [
  "En una palabra, ¿con qué te vas de este encuentro?",
  "¿Qué te llevás de alguien de este grupo?",
  "¿Qué dejás acá, que ya no necesitás cargar?",
  "Respirá hondo. ¿Cómo está tu cuerpo ahora, comparado con el comienzo?",
  "Agradecé algo a este grupo, a tu manera.",
  "¿Qué te gustaría recordar de este momento?",
];

export const FRASE = "Cuando nos animamos a mostrarnos, aparece lo esencial.";

export const MAX_JUGADORES = 6;

/** Botón "Paso": desactivado por ahora a pedido de Carlos. Poner en true para volver a habilitarlo. */
export const PERMITIR_PASO = false;
