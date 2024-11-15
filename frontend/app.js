const weekDays = ['월', '화', '수', '목', '금'];

// 교시별 시간 매핑
const periods = {
    1: '09:10~10:00', 2: '10:10~11:00', 3: '11:10~12:00',
    4: '12:10~13:00', 5: '13:10~14:00', 6: '14:10~15:00',
    7: '15:10~16:00', 8: '16:10~17:00', 9: '17:10~18:00',
    10: '18:10~19:00'
};

// 주간 시간표 생성 함수 (교시 기반)
function createWeeklyTimetable() {
    const timetableContainer = document.getElementById('weekly-timetable');
    timetableContainer.innerHTML = '';

    // 헤더 생성 (요일을 한글로 표시)
    const headerRow = document.createElement('div');
    headerRow.className = 'timetable-header';
    headerRow.innerHTML = `
        <div>교시</div>
        ${weekDays.map(day => `<div>${day}</div>`).join('')}
    `;
    timetableContainer.appendChild(headerRow);

    // 시간표 몸체 생성 (1교시~10교시)
    for (let i = 1; i <= 10; i++) {
        const timeRow = document.createElement('div');
        timeRow.className = 'timetable-body';
        timeRow.innerHTML = `
            <div class="time-label">${i}교시<br>(${periods[i]})</div>
            ${weekDays.map(() => '<div class="time-slot"></div>').join('')}
        `;
        timetableContainer.appendChild(timeRow);
    }
}

// 추천 강의 목록을 서버에서 가져와 표시
document.getElementById('recommendationForm').addEventListener('submit', (event) => {
    event.preventDefault(); // 폼 제출 시 새로고침 방지

    const recommendationsDiv = document.getElementById('recommendations');
    recommendationsDiv.innerHTML = '<p>추천 강의를 불러오는 중입니다...</p>';

    // 사용자가 선택한 선호 시간대 (오전/오후)
    const preferredTime = document.getElementById('time').value;
    const recommendations = getFilteredRecommendations(preferredTime);

    displayRecommendations(recommendations);
});

// 추천 강의 필터링 함수
function getFilteredRecommendations(preferredTime) {
    // 예시 추천 강의 데이터 (데이터베이스 연결 시 실제 데이터를 여기에 적용)
    const allRecommendations = [
        { id: 1, course: '컴퓨터공학개론', schedule: [{ day: '월', periods: '1~2' }, { day: '화', periods: '1' }], professor: '김교수' },
        { id: 2, course: '자료구조', schedule: [{ day: '월', periods: '6~7' }, { day: '수', periods: '6' }], professor: '이교수' },
        { id: 3, course: '알고리즘', schedule: [{ day: '금', periods: '8' }], professor: '박교수' }
    ];

    // 필터링 로직: 선호 시간대에 따라 필터링
    const filteredRecommendations = allRecommendations.filter(rec => {
        return rec.schedule.some(s => {
            const [startPeriod] = s.periods.split('~').map(p => parseInt(p));
            if (preferredTime === 'morning') {
                return startPeriod <= 3; // 오전: 1교시~3교시
            } else if (preferredTime === 'afternoon') {
                return startPeriod >= 4; // 오후: 4교시 이후
            }
            return false;
        });
    });

    return filteredRecommendations;
}

function displayRecommendations(recommendations) {
    const recommendationsDiv = document.getElementById('recommendations');
    recommendationsDiv.innerHTML = '';

    if (recommendations.length === 0) {
        recommendationsDiv.innerHTML = '<p>추천 강의가 없습니다. 조건을 다시 선택해 주세요.</p>';
        return;
    }

    recommendations.forEach(rec => {
        const recCard = document.createElement('div');
        recCard.className = 'recommendation-card';

        // 강의 시간표 정보 포맷팅 (예: "월1~2, 화1" 형태)
        const scheduleText = rec.schedule.map(s => `${s.day}${s.periods}`).join(', ');

        // 강의 정보 표시
        recCard.innerHTML = `
            <h3>${rec.course}</h3>
            <p>시간: ${scheduleText}</p>
            <p>교수님: ${rec.professor}</p>
            <button onclick='addToTimetable("${rec.course}", ${JSON.stringify(rec.schedule)}, "${rec.professor}")'>시간표에 추가</button>
        `;
        
        recommendationsDiv.appendChild(recCard);
    });
}

function addToTimetable(course, schedule, professor) {
    console.log(`Adding course: ${course}, Schedule:`, schedule, `Professor: ${professor}`);

    schedule.forEach(s => {
        const day = s.day; // 요일 (예: 월, 화)
        const dayIndex = weekDays.indexOf(day);
        const [startPeriod, endPeriod] = s.periods.split('~').map(p => parseInt(p));

        console.log(`Processing ${course} on ${day} from ${startPeriod}교시 to ${endPeriod || startPeriod}교시`);

        if (dayIndex === -1) {
            console.error("Invalid day:", day);
            return;
        }

        for (let period = startPeriod; period <= (endPeriod || startPeriod); period++) {
            const slots = document.querySelectorAll('.time-slot');
            const slotIndex = (period - 1) * 5 + dayIndex;
            const slot = slots[slotIndex];

            if (slot) {
                slot.innerHTML = `
                    <div class="course">
                        <div>${course}</div>
                        <small>${professor}</small>
                        <button class="remove-btn" onclick="removeFromTimetable('${course}', '${period}', '${day}')">삭제</button>
                    </div>
                `;
                console.log(`Course added to ${day}${period}교시 (slot index: ${slotIndex})`);
            } else {
                console.error("Time slot not found for index:", slotIndex);
            }
        }
    });
}

function removeFromTimetable(course, period, day) {
    const dayIndex = weekDays.indexOf(day);
    const periodIndex = parseInt(period) - 1;

    const slots = document.querySelectorAll('.time-slot');
    const slotIndex = periodIndex * 5 + dayIndex;
    const slot = slots[slotIndex];

    if (slot && slot.innerHTML.includes(course)) {
        slot.innerHTML = ''; // 강의 삭제
        console.log(`Course removed from period: ${period} on ${day}`);
    } else {
        console.error("Could not find course to remove:", course);
    }
}

// 페이지 로드 시 주간 시간표 생성
document.addEventListener('DOMContentLoaded', () => {
    createWeeklyTimetable();
});

















