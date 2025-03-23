let currentQuestionIndex = 0;
let questionArray = [];
let answersCorrect = 0;

function decodeHTMLEntities(text){
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
}
async function fetchData(){
    try{
        const response = await axios.get('https://opentdb.com/api.php?amount=10');
        const data = response.data.results;

        data.forEach(item => {
            const question = new Question(
                item.type,
                item.difficulty,
                item.category,
                item.question,
                item.correct_answer,
                item.incorrect_answers
            )
            questionArray.push(question);
        })

        console.log('Questions added:', questionArray);
        displayQuestions(questionArray);
    } catch (error){
        console.error("Error fetching data", error);
    }
}

function Question(type, difficulty, category, question, correct_answer, incorrect_answers){
    this.type = type;
    this.difficulty = difficulty;
    this.category = category;
    this.question = question;
    this.correct_answer = correct_answer;
    this.incorrect_answers = incorrect_answers;
}

function displayQuestions(questionArray){
    let question = document.getElementById("question");
    let answers = document.getElementById("answers");

    question.innerHTML = "";
    answers.innerHTML = "";

    if(currentQuestionIndex < questionArray.length){
        const currentQuestion = questionArray[currentQuestionIndex];
        
        const decodedQuestion = decodeHTMLEntities(currentQuestion.question);
        const decodedCorrectAnswer = decodeHTMLEntities(currentQuestion.correct_answer);
        const decodedIncorrectAnswers = currentQuestion.incorrect_answers.map(answer => decodeHTMLEntities(answer));

        question.textContent = decodedQuestion;
        const allAnswers = [...decodedIncorrectAnswers, decodedCorrectAnswer];

        allAnswers.sort(() => Math.random() - 0.5);

        allAnswers.forEach(answer => {
            const button = document.createElement("button");
            button.textContent = answer;
            answers.appendChild(button);

            button.addEventListener("click", () => {
                const allButtons = answers.querySelectorAll("button");
                allButtons.forEach(btn => {
                    btn.disabled = "true";
                });

                if(answer === decodedCorrectAnswer){
                    button.style.backgroundColor = "green";
                    button.textContent = "Correct!";
                    answersCorrect++;
                } else{
                    button.style.backgroundColor = "red";
                    button.textContent = "Incorrect!";

                    allButtons.forEach(btn => {
                        if(btn.textContent === decodedCorrectAnswer){
                            btn.style.backgroundColor = "green";
                            btn.textContent ="Correct!";
                        }
                    });
                }

            });
        });
    } else{
        const h2 = document.createElement("h2");
        h2.textContent = `Game Over! You scored ${answersCorrect} out of ${questionArray.length}.`;
        question.appendChild(h2);
        const nextButton = document.getElementById("next_question");
        nextButton.style.display = "none"; 
        const restartButton = document.getElementById("restart_game");
        restartButton.style.display = "inline-block";

    }
}

let next_question = document.getElementById("next_question");
next_question.addEventListener("click", () =>{
    currentQuestionIndex++;
    displayQuestions(questionArray);
});

let restart_game = document.getElementById("restart_game");
restart_game.addEventListener("click", () =>{
    currentQuestionIndex = 0;
    answersCorrect = 0;
    questionArray = [];

    const nextButton = document.getElementById("next_question");
    nextButton.style.display = "inline-block";

    const restartButton = document.getElementById("restart_game");
    restartButton.style.display = "none";

    fetchData();
});

document.addEventListener("DOMContentLoaded", fetchData);