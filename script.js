document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const fortuneButton = document.getElementById('fortune-button');
    const fortuneText = document.getElementById('fortune-text');
    const birdImage = document.getElementById('bird-image');
    const triviaButton = document.getElementById('trivia-button');
    const triviaText = document.getElementById('trivia-text');
    const pointDisplay = document.getElementById('point-display');
    const saveTriviaButton = document.getElementById('save-trivia-button');
    const triviaCollectionList = document.getElementById('trivia-collection-list');

    // Data
    const fortunes = [
        { text: '【大吉】ハトのように平和な一日。良い知らせが舞い込むでしょう。', bird: '🕊️' },
        { text: '【中吉】フクロウのように賢明な判断ができる日。勉強や仕事がはかどります。', bird: '🦉' },
        { text: '【小吉】スズメのように、小さな幸せを見つけられる一日。', bird: '🐦' },
        { text: '【吉】ツバメのように、素早い行動が幸運を呼び込みます。', bird: '🐦' },
        { text: '【末吉】ペンギンのように、仲間と協力することで困難を乗り越えられます。', bird: '🐧' },
        { text: '【凶】カラスに注意！忘れ物に気をつけましょう。', bird: '🐧' },
        { text: '【大吉】クジャクのように、あなたの魅力が輝く一日。人気者になれるかも。', bird: '🦚' },
        { text: '【中吉】アヒルのように、穏やかな心で過ごせる一日。リラックスが吉。', bird: '🦆' },
        { text: '【小吉】ニワトリのように、早起きすると良いことがありそう。', bird: '🐔' },
        { text: '【吉】オウムのように、コミュニケーションが活発になる日。新しい出会いも。', bird: '🦜' }
    ];

    const birdTrivia = [
        'ハチドリは、空中で静止することができる唯一の鳥です。',
        'フクロウの目は、眼球ではなく筒状になっているため、目を動かす代わりに首を大きく回します。',
        'ペンギンは、鳥類の中で唯一、飛べない代わりに水中を巧みに泳ぎます。',
        '世界で最も大きい鳥はダチョウで、最も小さい鳥はマメハチドリです。',
        'カラスは非常に賢く、人間の顔を記憶したり、道具を使ったりすることができます。',
        'ニワトリの祖先は、東南アジアに生息するセキショクヤケイという鳥です。',
        'フラミンゴのピンク色は、食べる藻や甲殻類に含まれる色素によるものです。'
    ];

    // Points System
    let currentPoints = parseInt(localStorage.getItem('birdFortunePoints')) || 0;
    let savedTrivia = JSON.parse(localStorage.getItem('savedBirdTrivia')) || [];

    function updatePointsDisplay() {
        pointDisplay.textContent = `現在のポイント: ${currentPoints}`;
        if (currentPoints < 2) {
            triviaButton.disabled = true;
            triviaButton.style.backgroundColor = '#ccc';
        } else {
            triviaButton.disabled = false;
            triviaButton.style.backgroundColor = '#17a2b8';
        }
    }

    function loadTriviaCollection() {
        triviaCollectionList.innerHTML = '';
        savedTrivia.forEach(trivia => {
            const triviaItem = document.createElement('div');
            triviaItem.textContent = trivia;
            triviaCollectionList.appendChild(triviaItem);
        });
    }

    // Daily Fortune Logic
    const today = new Date().toISOString().split('T')[0];
    const lastFortuneDate = localStorage.getItem('lastFortuneDate');

    if (lastFortuneDate === today) {
        fortuneButton.disabled = true;
        fortuneText.textContent = '今日の占いはもう終わりました。また明日お越しください。';
        fortuneButton.style.backgroundColor = '#ccc';
    }

    fortuneButton.addEventListener('click', () => {
        const currentDate = new Date().toISOString().split('T')[0];
        if (localStorage.getItem('lastFortuneDate') === currentDate) {
            return; 
        }

        const randomIndex = Math.floor(Math.random() * fortunes.length);
        const randomFortune = fortunes[randomIndex];

        fortuneText.textContent = randomFortune.text;
        birdImage.textContent = randomFortune.bird;
        birdImage.style.fontSize = '50px';
        birdImage.style.backgroundColor = 'transparent';

        currentPoints += 5;
        localStorage.setItem('birdFortunePoints', currentPoints);
        updatePointsDisplay();

        localStorage.setItem('lastFortuneDate', currentDate);
        fortuneButton.disabled = true;
        fortuneButton.style.backgroundColor = '#ccc';
    });

    // Trivia Logic
    triviaButton.addEventListener('click', () => {
        if (currentPoints < 2) {
            triviaText.textContent = 'ポイントが足りません。占いでポイントを貯めてください。';
            return;
        }

        currentPoints -= 2;
        localStorage.setItem('birdFortunePoints', currentPoints);
        updatePointsDisplay();

        const randomIndex = Math.floor(Math.random() * birdTrivia.length);
        const newTrivia = birdTrivia[randomIndex];
        triviaText.textContent = newTrivia;

        if (savedTrivia.includes(newTrivia)) {
            saveTriviaButton.style.display = 'none';
        } else {
            saveTriviaButton.style.display = 'inline-block';
        }
    });

    saveTriviaButton.addEventListener('click', () => {
        const triviaToSave = triviaText.textContent;
        if (currentPoints < 1) {
            alert('ポイントが足りません。');
            return;
        }
        if (savedTrivia.includes(triviaToSave)) {
            alert('この鳥ビアは既に保存されています。');
            return;
        }

        currentPoints -= 1;
        localStorage.setItem('birdFortunePoints', currentPoints);
        updatePointsDisplay();

        savedTrivia.push(triviaToSave);
        localStorage.setItem('savedBirdTrivia', JSON.stringify(savedTrivia));
        loadTriviaCollection();
        saveTriviaButton.style.display = 'none';
    });


    // Initial setup
    updatePointsDisplay();
    loadTriviaCollection();


    // Janken Game Logic
    const jankenButtons = document.querySelectorAll('.janken-button');
    const jankenResultText = document.getElementById('janken-result-text');
    const winStreakText = document.getElementById('win-streak-text');

    let winStreak = 0;

    jankenButtons.forEach(button => {
        button.addEventListener('click', () => {
            const playerHand = button.dataset.hand;
            const hands = ['rock', 'scissors', 'paper'];
            const computerHand = hands[Math.floor(Math.random() * hands.length)];

            let result = '';

            if (playerHand === computerHand) {
                result = '引き分けです。';
                winStreak = 0;
            } else if (
                (playerHand === 'rock' && computerHand === 'scissors') ||
                (playerHand === 'scissors' && computerHand === 'paper') ||
                (playerHand === 'paper' && computerHand === 'rock')
            ) {
                result = 'あなたの勝ちです！';
                winStreak++;
            } else {
                result = 'あなたの負けです。';
                winStreak = 0;
            }

            jankenResultText.textContent = `コンピュータは${computerHand}を出しました。${result}`;
            winStreakText.textContent = `現在の連勝数: ${winStreak}`;

            if (winStreak >= 2) {
                jankenResultText.textContent += ' 2連勝達成！占いをもう一度できます。';
                winStreak = 0;
                localStorage.removeItem('lastFortuneDate');
                fortuneButton.disabled = false;
                fortuneButton.style.backgroundColor = '#ffc107';
                fortuneText.textContent = '占いをどうぞ！';
            }
        });
    });
});