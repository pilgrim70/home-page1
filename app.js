document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Sticky Header scroll transition
  const header = document.getElementById('header');
  const scrollThreshold = 50;

  window.addEventListener('scroll', () => {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Drawer Navigation Toggle
  const menuBtn = document.getElementById('menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const toggleMenu = () => {
    menuBtn.classList.toggle('active');
    mobileNav.classList.toggle('open');
    document.body.classList.toggle('no-scroll'); // Prevent background scrolling when open
  };

  menuBtn.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Close mobile drawer when link is clicked
      if (mobileNav.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  // Prevent background scrolling CSS rule injection
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `body.no-scroll { overflow: hidden; }`;
  document.head.appendChild(styleEl);

  // 3. Dynamic Sermon Video Playlist Switcher
  const playlistItems = document.querySelectorAll('.playlist-item');
  const mainVideo = document.getElementById('mainSermonVideo');

  playlistItems.forEach(item => {
    item.addEventListener('click', () => {
      // Remove active class from all items
      playlistItems.forEach(i => i.classList.remove('active'));
      
      // Add active class to clicked item
      item.classList.add('active');
      
      // Get video ID and update YouTube embed src
      const videoId = item.getAttribute('data-video-id');
      if (videoId && mainVideo) {
        mainVideo.src = `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`;
      }
    });
  });

  // 4. Multi-page GNB Active Handler (Based on URL pathname)
  const navItems = document.querySelectorAll('.nav-menu.desktop .nav-item, .mobile-nav .nav-menu .nav-item');
  const path = window.location.pathname;
  let page = path.split('/').pop();
  
  // Default to index.html if empty
  if (!page || page === '') {
    page = 'index.html';
  }

  // Remove active from all items first
  navItems.forEach(item => item.classList.remove('active'));

  navItems.forEach(item => {
    const link = item.querySelector('a');
    if (link) {
      const href = link.getAttribute('href');
      if (href) {
        // Match base file names (e.g. intro.html from intro.html#servants)
        const linkPage = href.split('#')[0];
        
        if (linkPage === page || (page === 'index.html' && linkPage === '')) {
          item.classList.add('active');
          
          // Highlight parent dropdown if it's a child
          const parentItem = item.closest('.has-dropdown');
          if (parentItem) {
            parentItem.classList.add('active');
          }
        }
      }
    }
  });

  // 5. Scroll Reveal Animation using Intersection Observer
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px', // Trigger slightly before element enters view
    threshold: 0.15
  };

  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
  revealElements.forEach(el => revealObserver.observe(el));

  // 6. Mobile Sub-menu Dropdown Toggle
  const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');
  mobileDropdowns.forEach(dropdown => {
    const mainLink = dropdown.querySelector('a.nav-link');
    if (mainLink) {
      mainLink.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dropdown.classList.toggle('open');
        }
      });
    }
  });

  // 8. LocalStorage Bulletin Board Integration (Jubo & School Notice)
  
  // -- A. Default Mock Data (If LocalStorage is Empty) --
  const defaultNews = [
    { id: 1, title: '에베소서, 로마서 말씀으로 고백하는 <방패기도문>입니다.', date: '2025-09-19', content: '에베소서, 로마서 말씀으로 고백하는 방패기도문 전문입니다.\n\n매일 아침 이 기도로 무장하여 승리하는 삶을 사시길 축복합니다.\n(본문 생략)' },
    { id: 2, title: '2026년 8월 모바일 전도지', date: '2026-08-05', content: '2026년 8월 모바일 전도지입니다.\n\n이웃들에게 메신저로 전달하며 예수님의 사랑을 전해 보세요.' },
    { id: 3, title: '2026년 8월 첫째 주 가정예배순서지', date: '2026-08-01', content: '2026년 8월 첫째 주 가정예배 순서지입니다.\n\n각 가정에서 경건하게 예배드릴 때 활용해 주시기 바랍니다.' },
    { id: 4, title: '2026-08-02 더빛교회 주보', date: '2026-08-01', content: '2026년 8월 2일자 더빛교회 주보입니다.\n\n[예배 안내]\n1부 예배: 오전 9:00\n2부 예배: 오전 11:00\n\n[교회 소식]\n1. 다음 주일은 선교 헌금 작정일입니다.' },
    { id: 5, title: '2026년 7월 넷째 주 가정예배순서지', date: '2026-07-25', content: '2026년 7월 넷째 주 가정예배 순서지입니다.' },
    { id: 6, title: '2026-07-26 더빛교회 주보', date: '2026-07-25', content: '2026년 7월 26일자 더빛교회 주보입니다.' },
    { id: 7, title: '2026년 7월 셋째 주 가정예배 순서지', date: '2026-07-22', content: '2026년 7월 셋째 주 가정예배 순서지입니다.' }
  ];

  const defaultSchool = [
    { id: 1, title: '[유초등부] 여름성경학교 교사 및 도우미 모집', dept: 'kids', author: '박주은 전도사', date: '2026-06-11', content: '2026 여름성경학교를 섬길 교사 및 도우미를 모집합니다. 성도님들의 많은 관심과 기도 부탁드립니다.' },
    { id: 2, title: '[중고등부] 연합 여름 수련회 조편성 안내', dept: 'hero', author: '김태진 교사', date: '2026-06-05', content: '이번 여름 수련회 조편성 결과를 안내해 드립니다. 확인 후 궁금한 점은 담당 교사에게 문의하세요.' },
    { id: 3, title: '[축구동아리] K FC 주말 친선 경기 일정 공지', dept: 'kfc', author: '이성민 감독', date: '2026-06-01', content: '이번 주 토요일 오전 8시, 인근 체육공원에서 친선 경기가 예정되어 있습니다. 참가 멤버들은 7시 40분까지 모여주세요.' }
  ];

  // Helper function to get data from localStorage or set default
  function getBoardData(key, defaultData) {
    let data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(data);
  }

  function saveBoardData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // UI Modal Control Helpers
  function openModal(modalEl) {
    if (modalEl) {
      modalEl.style.display = 'flex';
      // force repaint
      modalEl.offsetHeight;
      modalEl.classList.add('show');
    }
  }

  function closeModal(modalEl) {
    if (modalEl) {
      modalEl.classList.remove('show');
      setTimeout(() => {
        modalEl.style.display = 'none';
      }, 300);
    }
  }

  // --- B. Church Notice (Jubo) Board Logic (news.html) ---
  const juboListBody = document.getElementById('jubo-list-body');
  if (juboListBody) {
    const newsModalWrite = document.getElementById('news-write-modal');
    const newsModalDetail = document.getElementById('news-detail-modal');
    const btnOpenNewsWrite = document.getElementById('btn-open-news-modal');
    const btnCloseNewsWrite = document.getElementById('btn-close-news-write');
    const btnCancelNewsWrite = document.getElementById('btn-cancel-news-write');
    const btnCloseNewsDetail = document.getElementById('btn-close-news-detail');
    const btnConfirmNewsDetail = document.getElementById('btn-confirm-news-detail');
    const newsWriteForm = document.getElementById('news-write-form');

    let newsData = getBoardData('news_posts', defaultNews);

    // Render news board function
    function renderNews() {
      juboListBody.innerHTML = '';
      if (newsData.length === 0) {
        juboListBody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 30px; color: var(--color-text-muted);">등록된 주보나 소식이 없습니다.</td></tr>`;
        return;
      }

      // Render items (newest first)
      newsData.slice().reverse().forEach((item, index) => {
        const tr = document.createElement('tr');
        const virtualNo = newsData.length - index;
        
        tr.innerHTML = `
          <td style="padding: 18px 20px; font-family: var(--font-en); font-weight: 500; color: var(--color-text-muted);">${virtualNo}</td>
          <td class="title-cell" style="padding: 18px 20px; font-weight: 500; color: #333; cursor: pointer;">${item.title}</td>
          <td class="date-cell" style="padding: 18px 20px; text-align: right; color: var(--color-text-muted); font-family: var(--font-en);">${item.date}</td>
          <td class="action-cell" style="padding: 18px 20px; text-align: center;">
            <button class="btn-delete" data-id="${item.id}"><i class="la la-trash"></i></button>
          </td>
        `;

        // Click event on title to show details
        tr.querySelector('.title-cell').addEventListener('click', () => {
          document.getElementById('news-detail-title').innerText = item.title;
          document.getElementById('news-detail-date').innerHTML = `<i class="la la-calendar"></i> 작성일자: ${item.date}`;
          document.getElementById('news-detail-body').innerText = item.content || '본문 내용이 없습니다.';
          openModal(newsModalDetail);
        });

        // Click event on delete button
        tr.querySelector('.btn-delete').addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm('이 글을 삭제하시겠습니까?')) {
            newsData = newsData.filter(p => p.id !== item.id);
            saveBoardData('news_posts', newsData);
            renderNews();
          }
        });

        juboListBody.appendChild(tr);
      });
    }

    // Modal Triggers
    if (btnOpenNewsWrite) {
      btnOpenNewsWrite.addEventListener('click', () => {
        // Reset and set default date to today
        newsWriteForm.reset();
        document.getElementById('news-date').value = new Date().toISOString().substring(0, 10);
        openModal(newsModalWrite);
      });
    }

    if (btnCloseNewsWrite) btnCloseNewsWrite.addEventListener('click', () => closeModal(newsModalWrite));
    if (btnCancelNewsWrite) btnCancelNewsWrite.addEventListener('click', () => closeModal(newsModalWrite));
    if (btnCloseNewsDetail) btnCloseNewsDetail.addEventListener('click', () => closeModal(newsModalDetail));
    if (btnConfirmNewsDetail) btnConfirmNewsDetail.addEventListener('click', () => closeModal(newsModalDetail));

    // Backdrop click to close
    document.getElementById('news-write-backdrop').addEventListener('click', () => closeModal(newsModalWrite));
    document.getElementById('news-detail-backdrop').addEventListener('click', () => closeModal(newsModalDetail));

    // Form Submit
    newsWriteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('news-title').value.trim();
      const date = document.getElementById('news-date').value;
      const content = document.getElementById('news-content').value.trim();

      const newPost = {
        id: Date.now(),
        title: title,
        date: date,
        content: content
      };

      newsData.push(newPost);
      saveBoardData('news_posts', newsData);
      closeModal(newsModalWrite);
      renderNews();
    });

    renderNews();
  }

  // --- C. Church School Notice Board Logic (school.html) ---
  const schoolListBody = document.getElementById('notice-list-body');
  if (schoolListBody) {
    const schoolModalWrite = document.getElementById('school-write-modal');
    const schoolModalDetail = document.getElementById('school-detail-modal');
    const btnOpenSchoolWrite = document.getElementById('btn-open-write-modal');
    const btnCloseSchoolWrite = document.getElementById('btn-close-school-write');
    const btnCancelSchoolWrite = document.getElementById('btn-cancel-school-write');
    const btnCloseSchoolDetail = document.getElementById('btn-close-school-detail');
    const btnConfirmSchoolDetail = document.getElementById('btn-confirm-school-detail');
    const schoolWriteForm = document.getElementById('school-write-form');
    const filterBtns = document.querySelectorAll('.notice-filters .filter-btn');

    let schoolData = getBoardData('school_posts', defaultSchool);
    let currentFilter = 'all';

    // Get Department Korean Name
    function getDeptKoName(dept) {
      switch(dept) {
        case 'kids': return '유초등부';
        case 'hero': return '중고등부';
        case 'kfc': return '축구동아리';
        default: return '공통';
      }
    }

    // Render school board function
    function renderSchool() {
      schoolListBody.innerHTML = '';
      const filteredData = schoolData.filter(item => currentFilter === 'all' || item.dept === currentFilter);

      if (filteredData.length === 0) {
        schoolListBody.innerHTML = `
          <div style="text-align: center; padding: 40px; color: var(--color-text-muted); width: 100%; grid-column: 1 / -1;">
            등록된 공지사항이 없습니다.
          </div>
        `;
        return;
      }

      filteredData.slice().reverse().forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'notice-list-row board-row';
        
        itemEl.innerHTML = `
          <div class="col-notice-num" style="font-family: var(--font-en); font-weight: 500;">${filteredData.length - index}</div>
          <div class="col-notice-dept"><span class="badge badge-${item.dept}">${getDeptKoName(item.dept)}</span></div>
          <div class="col-notice-title" style="cursor: pointer; font-weight: 500;">${item.title}</div>
          <div class="col-notice-author">${item.author}</div>
          <div class="col-notice-date" style="font-family: var(--font-en); color: var(--color-text-muted);">${item.date}</div>
          <div style="flex: 0 0 60px; display: flex; justify-content: center; align-items: center;">
            <button class="btn-delete" data-id="${item.id}" style="padding: 2px 8px; margin-left: auto;"><i class="la la-trash"></i></button>
          </div>
        `;

        // Click to view details
        itemEl.querySelector('.col-notice-title').addEventListener('click', () => {
          document.getElementById('school-detail-title').innerText = item.title;
          document.getElementById('school-detail-dept').innerHTML = `<i class="la la-tag"></i> 부서: ${getDeptKoName(item.dept)}`;
          document.getElementById('school-detail-author').innerHTML = `<i class="la la-user"></i> 작성자: ${item.author}`;
          document.getElementById('school-detail-date').innerHTML = `<i class="la la-calendar"></i> 작성일: ${item.date}`;
          document.getElementById('school-detail-body').innerText = item.content || '내용이 없습니다.';
          openModal(schoolModalDetail);
        });

        // Delete button click
        itemEl.querySelector('.btn-delete').addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm('이 글을 삭제하시겠습니까?')) {
            schoolData = schoolData.filter(p => p.id !== item.id);
            saveBoardData('school_posts', schoolData);
            renderSchool();
          }
        });

        schoolListBody.appendChild(itemEl);
      });
    }

    // Filter events
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderSchool();
      });
    });

    // Modal triggers
    if (btnOpenSchoolWrite) {
      btnOpenSchoolWrite.addEventListener('click', () => {
        schoolWriteForm.reset();
        openModal(schoolModalWrite);
      });
    }

    if (btnCloseSchoolWrite) btnCloseSchoolWrite.addEventListener('click', () => closeModal(schoolModalWrite));
    if (btnCancelSchoolWrite) btnCancelSchoolWrite.addEventListener('click', () => closeModal(schoolModalWrite));
    if (btnCloseSchoolDetail) btnCloseSchoolDetail.addEventListener('click', () => closeModal(schoolModalDetail));
    if (btnConfirmSchoolDetail) btnConfirmSchoolDetail.addEventListener('click', () => closeModal(schoolModalDetail));

    document.getElementById('school-write-backdrop').addEventListener('click', () => closeModal(schoolModalWrite));
    document.getElementById('school-detail-backdrop').addEventListener('click', () => closeModal(schoolModalDetail));

    // Submit form
    schoolWriteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('school-title').value.trim();
      const dept = document.getElementById('school-dept').value;
      const author = document.getElementById('school-author').value.trim();
      const content = document.getElementById('school-content').value.trim();

      const newPost = {
        id: Date.now(),
        title: title,
        dept: dept,
        author: author,
        date: new Date().toISOString().substring(0, 10),
        content: content
      };

      schoolData.push(newPost);
      saveBoardData('school_posts', schoolData);
      closeModal(schoolModalWrite);
      renderSchool();
    });

    renderSchool();
  }
});

// 7. Copy Bank Account Number Helper Function
window.copyAccount = function() {
  const accountNum = document.getElementById('account-number');
  if (accountNum) {
    const text = accountNum.innerText.trim();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        alert('헌금 계좌번호 (' + text + ')가 복사되었습니다.');
      }).catch(() => {
        prompt('계좌번호를 복사하세요:', text);
      });
    } else {
      prompt('계좌번호를 복사하세요:', text);
    }
  }
};
