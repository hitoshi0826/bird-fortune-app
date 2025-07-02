const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// ホスティングサービスのポート or ローカルの3001番ポートを利用
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// フロントエンドの静的ファイルを提供 (index.html, style.css, script.js)
app.use(express.static(path.join(__dirname, 'client')));

// APIエンドポイント (これはダミーです。実際のロジックに合わせてください)
app.post('/fortune', (req, res) => {
    // この部分は既存のロジックに合わせて調整が必要です
    // ダミーのレスポンスを返します
    res.json({ 
        name: "シマエナガ", 
        description: "雪の妖精。もふもふでかわいい。",
        compatible_bird: "スズメ",
        compatible_bird_description: "仲良くできる。",
        professions: ["デザイナー", "パティシエ"]
    });
});

// API以外のすべてのGETリクエストに対してindex.htmlを返す
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});