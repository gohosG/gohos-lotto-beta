document.addEventListener('DOMContentLoaded', () => {
  const generateBtn = document.getElementById('generate-btn');
  const numbersContainer = document.getElementById('lotto-numbers');
  const bonusCheckbox = document.getElementById('bonus-checkbox');
  const fiveGamesCheckbox = document.getElementById('five-games-checkbox');
  const themeToggleBtn = document.getElementById('theme-toggle');

  // 다크모드 설정 초기화
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggleBtn.textContent = '라이트 모드 ☀️';
  } else if (currentTheme === null && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // 사용자의 시스템 설정이 다크모드일 경우 기본으로 다크모드 적용
    document.body.classList.add('dark-mode');
    themeToggleBtn.textContent = '라이트 모드 ☀️';
  }

  // 다크모드 토글 버튼 이벤트
  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
      themeToggleBtn.textContent = '라이트 모드 ☀️';
      localStorage.setItem('theme', 'dark');
    } else {
      themeToggleBtn.textContent = '다크 모드 🌙';
      localStorage.setItem('theme', 'light');
    }
  });

  generateBtn.addEventListener('click', () => {
    // 버튼을 비활성화하여 중복 클릭 방지
    generateBtn.disabled = true;

    // 설정 확인
    const includeBonus = bonusCheckbox.checked;
    const isFiveGames = fiveGamesCheckbox.checked;
    const numberOfGames = isFiveGames ? 5 : 1;
    const totalNumbersToDraw = includeBonus ? 7 : 6;

    // 컨테이너 비우기
    numbersContainer.innerHTML = '';

    let gamesDrawn = 0;

    const drawGame = (gameIndex) => {
      // 1부터 45까지의 숫자 배열 생성
      const candidateNumbers = Array.from({ length: 45 }, (_, i) => i + 1);
      const selectedNumbers = [];

      // 랜덤한 숫자 뽑기 (중복 없음)
      while (selectedNumbers.length < totalNumbersToDraw) {
        const randomIndex = Math.floor(Math.random() * candidateNumbers.length);
        const number = candidateNumbers.splice(randomIndex, 1)[0];
        selectedNumbers.push(number);
      }

      // 앞의 6개 숫자만 오름차순 정렬
      const mainNumbers = selectedNumbers.slice(0, 6).sort((a, b) => a - b);
      const bonusNumber = includeBonus ? selectedNumbers[6] : null;

      // 게임(행)을 담을 컨테이너 생성
      const gameRow = document.createElement('div');
      gameRow.classList.add('game-row');
      numbersContainer.appendChild(gameRow);

      const renderBall = (number, elementIndex, isBonus = false, isPlus = false) => {
        // 전체 진행 시간에 맞춰 애니메이션 딜레이 설정
        // 게임 인덱스와 공의 인덱스를 고려하여 순차적으로 렌더링
        const delay = (gameIndex * (totalNumbersToDraw * 100)) + (elementIndex * 100);
        
        setTimeout(() => {
          if (isPlus) {
            const plus = document.createElement('div');
            plus.classList.add('plus-sign');
            plus.textContent = '+';
            gameRow.appendChild(plus);
          } else {
            const ball = document.createElement('div');
            ball.classList.add('ball');
            ball.textContent = number;
            
            // 번호 대역별로 색상 클래스 추가
            if (number <= 10) {
              ball.classList.add('color-yellow');
            } else if (number <= 20) {
              ball.classList.add('color-blue');
            } else if (number <= 30) {
              ball.classList.add('color-red');
            } else if (number <= 40) {
              ball.classList.add('color-grey');
            } else {
              ball.classList.add('color-green');
            }

            gameRow.appendChild(ball);
          }

          // 마지막 게임의 마지막 요소가 렌더링 된 후 버튼 활성화
          const totalElements = includeBonus ? 8 : 6;
          if (gameIndex === numberOfGames - 1 && elementIndex === totalElements - 1) {
            generateBtn.disabled = false;
          }
        }, delay);
      };

      // 6개의 메인 번호 렌더링
      mainNumbers.forEach((number, index) => {
        renderBall(number, index);
      });

      // 보너스 번호가 있는 경우 + 기호와 보너스 번호 렌더링
      if (includeBonus) {
        renderBall(null, 6, false, true); // + 기호
        renderBall(bonusNumber, 7, true, false); // 보너스 공
      }
    };

    for (let i = 0; i < numberOfGames; i++) {
      drawGame(i);
    }
  });
});
