// --- ESTADO DEL JUEGO ---
let currentQuestionIndex = 0;
let hearts = 3;
let xp = 0;
let selectedOptionId = null;
let isAnswerChecked = false;

// --- BASE DE DATOS DE PREGUNTAS ---
// 'correctId' coincide con el atributo data-id de los botones (1, 2, 3 o 4)
const questions = [
    {
        question: "¿Quién es considerado el padre del psicoanálisis?",
        options: ["Carl Jung", "Sigmund Freud", "B.F. Skinner", "William James"],
        correctId: 2,
        explanation: "Sigmund Freud desarrolló la teoría del inconsciente y el psicoanálisis a finales del siglo XIX."
    },
    {
        question: "¿Qué psicólogo es famoso por el condicionamiento clásico con perros?",
        options: ["Iván Pavlov", "John Watson", "Albert Bandura", "Edward Thorndike"],
        correctId: 1,
        explanation: "Iván Pavlov demostró el condicionamiento clásico haciendo sonar una campana antes de dar comida a unos perros."
    },
    {
        question: "¿Cuál de estas es la necesidad más alta en la Pirámide de Maslow?",
        options: ["Seguridad", "Pertenencia", "Autorrealización", "Estima"],
        correctId: 3,
        explanation: "La autorrealización está en la cúspide de la pirámide y representa el deseo de alcanzar el máximo potencial."
    },
    {
        question: "¿Qué corriente psicológica se enfoca en los pensamientos y procesos mentales internos?",
        options: ["Conductismo", "Psicoanálisis", "Cognitivismo", "Humanismo"],
        correctId: 3,
        explanation: "El cognitivismo estudia cómo la gente piensa, percibe, recuerda y aprende, a diferencia del conductismo que solo mira la conducta observable."
    },
    {
        question: "¿Quién propuso las etapas del desarrollo psicosexual?",
        options: ["Erik Erikson", "Jean Piaget", "Sigmund Freud", "Lev Vygotsky"],
        correctId: 3,
        explanation: "Freud fue quien dividió el desarrollo infantil en etapas psicosexuales (oral, anal, fálica, latencia, genital)."
    }
];

// --- ELEMENTOS DEL DOM ---
const heartsDisplay = document.getElementById('hearts-display');
const xpDisplay = document.getElementById('xp-display');
const progressFill = document.getElementById('progress-fill');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const checkBtn = document.getElementById('check-btn');
const feedbackBanner = document.getElementById('feedback-banner');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackText = document.getElementById('feedback-text');
const continueBtn = document.getElementById('continue-btn');

// --- FUNCIONES ---

// Inicializa el juego cargando la primera pregunta
function initGame() {
    loadQuestion();
    setupEventListeners();
}

// Carga los datos de la pregunta actual en el HTML
function loadQuestion() {
    // Resetear estados
    isAnswerChecked = false;
    selectedOptionId = null;
    checkBtn.classList.remove('active');
    feedbackBanner.classList.remove('show', 'wrong');

    const currentQuestion = questions[currentQuestionIndex];
    
    // Actualizar texto de pregunta
    questionText.textContent = currentQuestion.question;

    // Generar botones de opciones dinámicamente
    optionsContainer.innerHTML = '';
    currentQuestion.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        // El ID empieza en 1 para que sea más fácil de leer en la base de datos
        btn.setAttribute('data-id', index + 1);
        btn.textContent = option;
        optionsContainer.appendChild(btn);
    });
}

// Configura los eventos de clic (usando delegación de eventos para los botones dinámicos)
function setupEventListeners() {
    // Delegación de eventos para las opciones
    optionsContainer.addEventListener('click', (e) => {
        if (isAnswerChecked) return; // No dejar cambiar respuesta si ya se comprobó
        
        const clickedBtn = e.target.closest('.option-btn');
        if (!clickedBtn) return;

        // Quitar selección previa
        document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
        
        // Marcar nueva selección
        clickedBtn.classList.add('selected');
        selectedOptionId = parseInt(clickedBtn.getAttribute('data-id'));
        
        // Activar botón de comprobar
        checkBtn.classList.add('active');
    });

    // Evento del botón COMPROBAR
    checkBtn.addEventListener('click', handleCheck);

    // Evento del botón CONTINUAR
    continueBtn.addEventListener('click', handleContinue);
}

// Valida si la respuesta es correcta o incorrecta
function handleCheck() {
    if (selectedOptionId === null) return;
    isAnswerChecked = true;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOptionId === currentQuestion.correctId;

    // Desactivar botones de opciones para que no se pueda hacer clic
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.style.pointerEvents = 'none';
    });

    if (isCorrect) {
        // Lógica de acierto
        xp += 10;
        feedbackBanner.classList.remove('wrong');
        feedbackTitle.textContent = '¡Correcto!';
        feedbackText.textContent = currentQuestion.explanation;
        
        // Pintar de verde la opción correcta
        highlightCorrectOption();
    } else {
        // Lógica de fallo
        hearts--;
        feedbackBanner.classList.add('wrong');
        feedbackTitle.textContent = 'Respuesta incorrecta';
        feedbackText.textContent = currentQuestion.explanation;
        
        // Pintar de rojo la incorrecta y de verde la correcta
        highlightWrongAndCorrectOptions();
    }

    // Actualizar interfaz
    updateUI();
    
    // Mostrar banner de abajo
    feedbackBanner.classList.add('show');

    // Desactivar botón comprobar
    checkBtn.classList.remove('active');
}

// Avanza a la siguiente pregunta o termina el juego
function handleContinue() {
    if (hearts <= 0) {
        endGame(false);
        return;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex >= questions.length) {
        endGame(true);
        return;
    }

    // Actualizar barra de progreso
    const progressPercentage = (currentQuestionIndex / questions.length) * 100;
    progressFill.style.width = `${progressPercentage}%`;

    loadQuestion();
}

// Actualiza los números de corazones y XP en pantalla
function updateUI() {
    heartsDisplay.textContent = `❤️ ${hearts}`;
    xpDisplay.textContent = `⭐ ${xp} XP`;
}

// Pinta de verde la opción correcta
function highlightCorrectOption() {
    const currentQuestion = questions[currentQuestionIndex];
    const correctBtn = document.querySelector(`.option-btn[data-id="${currentQuestion.correctId}"]`);
    if(correctBtn) {
        correctBtn.classList.remove('selected');
        correctBtn.style.backgroundColor = '#D7FFB8';
        correctBtn.style.borderColor = '#58CC02';
        correctBtn.style.color = '#58A700';
        correctBtn.style.borderBottom = '5px solid #58A700';
    }
}

// Pinta de rojo la seleccionada y de verde la correcta
function highlightWrongAndCorrectOptions() {
    const currentQuestion = questions[currentQuestionIndex];
    const wrongBtn = document.querySelector(`.option-btn[data-id="${selectedOptionId}"]`);
    const correctBtn = document.querySelector(`.option-btn[data-id="${currentQuestion.correctId}"]`);

    if(wrongBtn) {
        wrongBtn.classList.remove('selected');
        wrongBtn.style.backgroundColor = '#FFDFE0';
        wrongBtn.style.borderColor = '#FF4B4B';
        wrongBtn.style.color = '#EA2B2B';
        wrongBtn.style.borderBottom = '5px solid #EA2B2B';
    }

    if(correctBtn) {
        correctBtn.classList.remove('selected');
        correctBtn.style.backgroundColor = '#D7FFB8';
        correctBtn.style.borderColor = '#58CC02';
        correctBtn.style.color = '#58A700';
        correctBtn.style.borderBottom = '5px solid #58A700';
    }
}

// Muestra la pantalla de fin de juego
function endGame(isCompleted) {
    if (isCompleted) {
        // Completar la barra de progreso al 100%
        progressFill.style.width = '100%';
        alert(`¡Lección completada! 🎉\nHas ganado ${xp} XP.`);
    } else {
        alert(`¡Te has quedado sin corazones! 💔\nHas ganado ${xp} XP. ¡Inténtalo de nuevo!`);
    }
    
    // Recargar la página para reiniciar (sencillo para GitHub Pages)
    location.reload();
}

// --- ARRANCAR EL JUEGO ---
initGame();
