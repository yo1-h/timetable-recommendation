// backend/routes/recommendation.js

const express = require('express');
const router = express.Router();

// Mock 데이터 - 실제 데이터베이스 연결을 설정하려면 이 부분을 DB 쿼리로 교체하세요.
let savedTimetable = []; // 저장된 시간표를 관리하는 배열

// 추천 결과 조회
router.post('/', (req, res) => {
    const { grade, major, time } = req.body;

    const recommendations = [
        { id: 1, course: 'Math 101', time: '09:00-10:00', professor: 'Prof. A' },
        { id: 2, course: 'History 202', time: '10:00-11:00', professor: 'Prof. B' }
    ];

    res.json(recommendations);
});

// 저장된 시간표 조회
router.get('/timetable', (req, res) => {
    res.json(savedTimetable);
});

// 시간표에 추천된 과목 추가
router.post('/timetable', (req, res) => {
    const { course } = req.body;
    savedTimetable.push(course);
    res.json({ message: 'Course added to timetable', savedTimetable });
});

// 시간표에서 과목 제거
router.delete('/timetable/:id', (req, res) => {
    const courseId = parseInt(req.params.id, 10);
    savedTimetable = savedTimetable.filter(course => course.id !== courseId);
    res.json({ message: 'Course removed from timetable', savedTimetable });
});

module.exports = router;

