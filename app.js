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

  // 3. Sermon Board System (LocalStorage-based CRUD)
  const mainVideo = document.getElementById('mainSermonVideo');
  const sermonPlaylistContainer = document.getElementById('sermon-playlist-items');

  // Default sermon data (초기 데이터)
  const defaultSermons = [
    {
      id: 1,
      title: '복의 근원이 되는 거룩한 삶의 기쁨',
      date: '2026-06-14',
      preacher: '담임목사 송기운',
      scripture: '창세기 12:1-3',
      series: '주일낮예배',
      videoId: 'z5D_B9I7l1Y',
      youtubeUrl: 'https://www.youtube.com/watch?v=z5D_B9I7l1Y'
    },
    {
      id: 2,
      title: '관유(기름부으심)의 능력과 평화의 공동체',
      date: '2026-06-07',
      preacher: '담임목사 송기운',
      scripture: '시편 133:1-3',
      series: '주일낮예배',
      videoId: '8fD5PjS5tQ4',
      youtubeUrl: 'https://www.youtube.com/watch?v=8fD5PjS5tQ4'
    },
    {
      id: 3,
      title: '위로와 치유, 상처 입은 마음을 만지시는 하나님',
      date: '2026-05-31',
      preacher: '담임목사 송기운',
      scripture: '이사야 61:1-3',
      series: '주일낮예배',
      videoId: 'W8744U1mE6Q',
      youtubeUrl: 'https://www.youtube.com/watch?v=W8744U1mE6Q'
    }
  ];

  // LocalStorage key
  const SERMON_STORAGE_KEY = 'sermon_posts_v1';

  function getSermonData() {
    let data = localStorage.getItem(SERMON_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(SERMON_STORAGE_KEY, JSON.stringify(defaultSermons));
      return [...defaultSermons];
    }
    return JSON.parse(data);
  }

  function saveSermonData(data) {
    localStorage.setItem(SERMON_STORAGE_KEY, JSON.stringify(data));
  }

  // YouTube URL → Video ID 추출
  function extractYouTubeId(url) {
    if (!url) return null;
    url = url.trim();
    // youtu.be/ID
    let match = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];
    // youtube.com/watch?v=ID
    match = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];
    // youtube.com/embed/ID
    match = url.match(/embed\/([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];
    // youtube.com/shorts/ID
    match = url.match(/shorts\/([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];
    // youtube.com/live/ID
    match = url.match(/live\/([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];
    // 직접 ID만 입력한 경우 (11자리)
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
    return null;
  }

  // Toast helper
  function showSermonToast(message) {
    let toast = document.querySelector('.sermon-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'sermon-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  // -- Sermon Detail Modal --
  const sermonModal = document.getElementById('sermon-detail-modal');
  const sermonDetailVideo = document.getElementById('sermonDetailVideo');
  const sermonDetailTitle = document.getElementById('sermon-detail-title');
  const sermonDetailSeries = document.getElementById('sermon-detail-series');
  const sermonDetailPreacher = document.getElementById('sermon-detail-preacher');
  const sermonDetailScripture = document.getElementById('sermon-detail-scripture');
  const sermonDetailDate = document.getElementById('sermon-detail-date');
  const sermonYtLink = document.getElementById('sermon-yt-link');
  const sermonShareBtn = document.getElementById('sermon-share-btn');
  const sermonEditBtn = document.getElementById('sermon-edit-btn');
  const sermonDeleteBtn = document.getElementById('sermon-delete-btn');
  const sermonDetailClose = document.getElementById('sermon-detail-close');
  const sermonDetailBackdrop = document.getElementById('sermon-detail-backdrop');

  let currentSermonDetailId = null;

  function openSermonDetail(sermonItem) {
    if (!sermonModal) return;
    currentSermonDetailId = sermonItem.id;

    if (sermonDetailVideo) {
      sermonDetailVideo.src = `https://www.youtube.com/embed/${sermonItem.videoId}?rel=0&autoplay=1`;
    }
    if (sermonDetailTitle) sermonDetailTitle.textContent = sermonItem.title;
    if (sermonDetailSeries) sermonDetailSeries.textContent = sermonItem.series || '';
    if (sermonDetailPreacher) sermonDetailPreacher.textContent = sermonItem.preacher || '';
    if (sermonDetailScripture) sermonDetailScripture.textContent = sermonItem.scripture || '';
    if (sermonDetailDate) sermonDetailDate.textContent = sermonItem.date || '';
    if (sermonYtLink) {
      sermonYtLink.href = `https://www.youtube.com/watch?v=${sermonItem.videoId}`;
    }
    sermonModal.setAttribute('data-current-video-id', sermonItem.videoId);
    sermonModal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeSermonDetail() {
    if (!sermonModal) return;
    sermonModal.classList.remove('show');
    document.body.style.overflow = '';
    if (sermonDetailVideo) sermonDetailVideo.src = '';
    currentSermonDetailId = null;
  }

  if (sermonDetailClose) sermonDetailClose.addEventListener('click', closeSermonDetail);
  if (sermonDetailBackdrop) sermonDetailBackdrop.addEventListener('click', closeSermonDetail);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (sermonModal && sermonModal.classList.contains('show')) closeSermonDetail();
      if (sermonWriteModal && sermonWriteModal.classList.contains('show')) closeSermonWrite();
    }
  });

  // Share button
  if (sermonShareBtn) {
    sermonShareBtn.addEventListener('click', () => {
      const videoId = sermonModal ? sermonModal.getAttribute('data-current-video-id') : '';
      const url = `https://www.youtube.com/watch?v=${videoId}`;
      navigator.clipboard.writeText(url).then(() => {
        showSermonToast('링크가 클립보드에 복사되었습니다!');
      }).catch(() => {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showSermonToast('링크가 클립보드에 복사되었습니다!');
      });
    });
  }

  // Edit button in detail modal
  if (sermonEditBtn) {
    sermonEditBtn.addEventListener('click', () => {
      if (currentSermonDetailId === null) return;
      const sermons = getSermonData();
      const item = sermons.find(s => s.id === currentSermonDetailId);
      if (!item) return;
      closeSermonDetail();
      openSermonWrite(item); // open in edit mode
    });
  }

  // Delete button in detail modal
  if (sermonDeleteBtn) {
    sermonDeleteBtn.addEventListener('click', () => {
      if (currentSermonDetailId === null) return;
      openDeleteConfirm(currentSermonDetailId);
    });
  }

  // -- Delete Confirm Modal --
  const deleteConfirmModal = document.getElementById('sermon-delete-confirm');
  const deleteConfirmBackdrop = document.getElementById('sermon-delete-confirm-backdrop');
  const deleteOkBtn = document.getElementById('sermon-delete-ok');
  const deleteCancelBtn = document.getElementById('sermon-delete-cancel');
  let pendingDeleteSermonId = null;

  function openDeleteConfirm(id) {
    pendingDeleteSermonId = id;
    if (deleteConfirmModal) deleteConfirmModal.classList.add('show');
  }
  function closeDeleteConfirm() {
    pendingDeleteSermonId = null;
    if (deleteConfirmModal) deleteConfirmModal.classList.remove('show');
  }
  if (deleteCancelBtn) deleteCancelBtn.addEventListener('click', closeDeleteConfirm);
  if (deleteConfirmBackdrop) deleteConfirmBackdrop.addEventListener('click', closeDeleteConfirm);
  if (deleteOkBtn) {
    deleteOkBtn.addEventListener('click', () => {
      if (pendingDeleteSermonId !== null) {
        let sermons = getSermonData();
        sermons = sermons.filter(s => s.id !== pendingDeleteSermonId);
        saveSermonData(sermons);
        closeDeleteConfirm();
        closeSermonDetail();
        renderSermonPlaylist();
        showSermonToast('설교가 삭제되었습니다.');
      }
    });
  }

  // -- Sermon Write/Edit Modal --
  const sermonWriteModal = document.getElementById('sermon-write-modal');
  const sermonWriteBackdrop = document.getElementById('sermon-write-backdrop');
  const sermonWriteClose = document.getElementById('sermon-write-close');
  const sermonWriteForm = document.getElementById('sermon-write-form');
  const sermonWriteTitle = document.getElementById('sermon-write-modal-title');
  const sermonFormCancel = document.getElementById('sermon-form-cancel');
  const sermonFormSubmit = document.getElementById('sermon-form-submit');
  const btnSermonWrite = document.getElementById('btn-sermon-write');
  const youtubeInput = document.getElementById('sermon-form-youtube');
  const youtubePreview = document.getElementById('youtube-preview');

  let editingSermonId = null;

  function openSermonWrite(editItem) {
    if (!sermonWriteModal) return;
    if (editItem) {
      // Edit mode
      editingSermonId = editItem.id;
      if (sermonWriteTitle) sermonWriteTitle.innerHTML = '<i class="la la-edit"></i> 설교 수정';
      if (sermonFormSubmit) sermonFormSubmit.innerHTML = '<i class="la la-check"></i> 수정 완료';
      document.getElementById('sermon-form-title').value = editItem.title || '';
      document.getElementById('sermon-form-date').value = editItem.date || '';
      document.getElementById('sermon-form-series').value = editItem.series || '주일낮예배';
      document.getElementById('sermon-form-preacher').value = editItem.preacher || '';
      document.getElementById('sermon-form-scripture').value = editItem.scripture || '';
      document.getElementById('sermon-form-youtube').value = editItem.youtubeUrl || `https://www.youtube.com/watch?v=${editItem.videoId}`;
      updateYoutubePreview(editItem.videoId);
    } else {
      // New mode
      editingSermonId = null;
      if (sermonWriteTitle) sermonWriteTitle.innerHTML = '<i class="la la-edit"></i> 설교 등록';
      if (sermonFormSubmit) sermonFormSubmit.innerHTML = '<i class="la la-check"></i> 등록하기';
      sermonWriteForm.reset();
      document.getElementById('sermon-form-date').value = new Date().toISOString().substring(0, 10);
      document.getElementById('sermon-form-preacher').value = '담임목사 송기운';
      clearYoutubePreview();
    }
    sermonWriteModal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeSermonWrite() {
    if (!sermonWriteModal) return;
    sermonWriteModal.classList.remove('show');
    document.body.style.overflow = '';
    editingSermonId = null;
  }

  // YouTube 미리보기 업데이트
  function updateYoutubePreview(videoId) {
    if (!youtubePreview || !videoId) return;
    youtubePreview.innerHTML = `
      <div class="youtube-preview-frame">
        <iframe src="https://www.youtube.com/embed/${videoId}?rel=0" allowfullscreen></iframe>
      </div>
      <p class="youtube-preview-ok"><i class="la la-check-circle"></i> 영상이 확인되었습니다. (ID: ${videoId})</p>
    `;
  }

  function clearYoutubePreview() {
    if (!youtubePreview) return;
    youtubePreview.innerHTML = `<p class="youtube-preview-msg"><i class="la la-info-circle"></i> YouTube 링크를 입력하면 미리보기가 표시됩니다.</p>`;
  }

  // YouTube 링크 입력 시 실시간 미리보기
  if (youtubeInput) {
    let ytDebounce = null;
    youtubeInput.addEventListener('input', () => {
      clearTimeout(ytDebounce);
      ytDebounce = setTimeout(() => {
        const videoId = extractYouTubeId(youtubeInput.value);
        if (videoId) {
          updateYoutubePreview(videoId);
        } else if (youtubeInput.value.trim().length > 0) {
          youtubePreview.innerHTML = `<p class="youtube-preview-err"><i class="la la-exclamation-circle"></i> 유효한 YouTube 링크를 입력해주세요.</p>`;
        } else {
          clearYoutubePreview();
        }
      }, 400);
    });
  }

  // Open Write Modal
  if (btnSermonWrite) {
    btnSermonWrite.addEventListener('click', () => openSermonWrite(null));
  }

  // Close Write Modal
  if (sermonWriteClose) sermonWriteClose.addEventListener('click', closeSermonWrite);
  if (sermonWriteBackdrop) sermonWriteBackdrop.addEventListener('click', closeSermonWrite);
  if (sermonFormCancel) sermonFormCancel.addEventListener('click', closeSermonWrite);

  // Form Submit (Create / Update)
  if (sermonWriteForm) {
    sermonWriteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('sermon-form-title').value.trim();
      const date = document.getElementById('sermon-form-date').value;
      const series = document.getElementById('sermon-form-series').value;
      const preacher = document.getElementById('sermon-form-preacher').value.trim();
      const scripture = document.getElementById('sermon-form-scripture').value.trim();
      const youtubeUrl = document.getElementById('sermon-form-youtube').value.trim();
      const videoId = extractYouTubeId(youtubeUrl);

      if (!title || !date || !videoId) {
        showSermonToast('제목, 날짜, 유효한 YouTube 링크를 입력해주세요.');
        return;
      }

      let sermons = getSermonData();

      if (editingSermonId !== null) {
        // Update
        sermons = sermons.map(s => {
          if (s.id === editingSermonId) {
            return { ...s, title, date, series, preacher, scripture, videoId, youtubeUrl };
          }
          return s;
        });
        showSermonToast('설교가 수정되었습니다.');
      } else {
        // Create
        const newId = sermons.length > 0 ? Math.max(...sermons.map(s => s.id)) + 1 : 1;
        sermons.unshift({
          id: newId,
          title, date, series, preacher, scripture, videoId, youtubeUrl
        });
        showSermonToast('설교가 등록되었습니다.');
      }

      saveSermonData(sermons);
      closeSermonWrite();
      renderSermonPlaylist();
    });
  }

  // -- Render Sermon Playlist --
  function renderSermonPlaylist() {
    if (!sermonPlaylistContainer) return;
    const sermons = getSermonData();
    
    // Sort by date descending
    sermons.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (sermons.length === 0) {
      sermonPlaylistContainer.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--color-text-muted);">
          <i class="la la-video" style="font-size: 2.5rem; display: block; margin-bottom: 12px; opacity: 0.4;"></i>
          등록된 설교가 없습니다.<br>[글쓰기] 버튼을 눌러 설교를 등록해 보세요.
        </div>`;
      if (mainVideo) mainVideo.src = '';
      return;
    }

    // Set main video to the first sermon
    if (mainVideo && sermons[0].videoId) {
      mainVideo.src = `https://www.youtube.com/embed/${sermons[0].videoId}?rel=0`;
    }

    sermonPlaylistContainer.innerHTML = '';
    sermons.forEach((sermon, index) => {
      const item = document.createElement('div');
      item.className = 'playlist-item' + (index === 0 ? ' active' : '');
      item.innerHTML = `
        <div class="playlist-thumb">
          <img src="https://img.youtube.com/vi/${sermon.videoId}/hqdefault.jpg" alt="설교 썸네일" loading="lazy">
        </div>
        <div class="playlist-info">
          <h4 class="playlist-title">[${sermon.series || '설교'}] ${sermon.title}</h4>
          <span class="playlist-date">${sermon.date}</span>
        </div>
      `;
      item.addEventListener('click', () => {
        // Update active state
        sermonPlaylistContainer.querySelectorAll('.playlist-item').forEach(el => el.classList.remove('active'));
        item.classList.add('active');
        // Update main player
        if (mainVideo && sermon.videoId) {
          mainVideo.src = `https://www.youtube.com/embed/${sermon.videoId}?rel=0&autoplay=1`;
        }
        // Open detail modal
        openSermonDetail(sermon);
      });
      sermonPlaylistContainer.appendChild(item);
    });
  }

  // Initial render
  if (sermonPlaylistContainer) {
    renderSermonPlaylist();
  }

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
    {
      id: 1,
      title: '에베소서, 로마서 말씀으로 고백하는 〈방패기도문〉입니다.',
      category: 'news',
      author: '교회 행정실',
      date: '2025-09-19',
      content: '에베소서와 로마서 말씀으로 고백하는 방패기도문 전문입니다. 매일 믿음으로 선포하시기 바랍니다.',
      isPinned: true
    },
    {
      id: 304,
      title: '2026 전교인 여름 수련회 은혜의 현장 사진 스케치',
      category: 'gallery',
      author: '미디어팀',
      date: '2026-08-05',
      content: '성령의 뜨거운 임재와 은혜로운 교제가 넘쳤던 2026 전교인 여름 수련회 현장 사진입니다.',
      file: {
        name: 'summer_retreat_2026.png',
        size: '1.03 MB',
        type: 'image/png',
        dataUrl: 'assets/summer-banner.png',
        isImage: true
      }
    },
    {
      id: 303,
      title: '2026년 8월 모바일 전도지 배포 안내',
      category: 'news',
      author: '선교부',
      date: '2026-08-08',
      content: '2026년 8월 모바일 전도지입니다. 주변 이웃들에게 생명의 복음을 널리 전해주세요.'
    },
    {
      id: 302,
      title: '2026-08-02 관유중앙교회 주보',
      category: 'jubo',
      author: '예배부',
      date: '2026-08-01',
      content: '2026년 8월 2일 관유중앙교회 주보입니다.'
    },
    {
      id: 301,
      title: '2026년 8월 첫째 주 가정예배순서지',
      category: 'jubo',
      author: '예배부',
      date: '2026-08-01',
      content: '2026년 8월 첫째 주 가정예배 순서지입니다.'
    },
    {
      id: 300,
      title: '주일 대예배 찬양과 은혜로운 예배 모습',
      category: 'gallery',
      author: '미디어팀',
      date: '2026-07-27',
      content: '하나님께 영광 올려드리는 주일 대예배와 찬양팀의 아름다운 찬양 모습입니다.',
      file: {
        name: 'sunday_worship.png',
        size: '620 KB',
        type: 'image/png',
        dataUrl: 'assets/church-banner.png',
        isImage: true
      }
    },
    {
      id: 299,
      title: '2026-07-26 관유중앙교회 주보',
      category: 'jubo',
      author: '예배부',
      date: '2026-07-25',
      content: '2026년 7월 26일 관유중앙교회 주보입니다.'
    },
    {
      id: 298,
      title: '2026년 7월 넷째 주 가정예배순서지',
      category: 'jubo',
      author: '예배부',
      date: '2026-07-25',
      content: '2026년 7월 넷째 주 가정예배 순서지입니다.'
    },
    {
      id: 297,
      title: '교회학교 여름성경학교 축복의 순간',
      category: 'gallery',
      author: '교회학교',
      date: '2026-07-15',
      content: '어린이들의 웃음과 기도가 가득했던 여름성경학교 은혜의 현장 사진입니다.',
      file: {
        name: 'vbs_kids_photo.jpg',
        size: '213 KB',
        type: 'image/jpeg',
        dataUrl: 'assets/teacher2.jpg',
        isImage: true
      }
    },
    {
      id: 296,
      title: '2026년 하반기 구역 사역 및 정기 심방 일정 공지',
      category: 'news',
      author: '교회 행정실',
      date: '2026-07-10',
      content: '2026년 하반기 구역 모임 및 정기 심방 일정을 안내해 드립니다.'
    }
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

  // Close modal helper
  function closeModal(modalEl) {
    if (modalEl) {
      modalEl.classList.remove('show');
      setTimeout(() => {
        modalEl.style.display = 'none';
      }, 300);
    }
  }

  // --- C. Clean & Minimal File Attachment Helper ---
  function setupFileUpload(browseBtnId, inputId, statusId, previewId, titleInputId, contentInputId) {
    const browseBtn = document.getElementById(browseBtnId);
    const fileInput = document.getElementById(inputId);
    const statusText = document.getElementById(statusId);
    const previewContainer = document.getElementById(previewId);
    const titleInput = document.getElementById(titleInputId);
    const contentInput = document.getElementById(contentInputId);

    let attachedFile = null;

    function resetAttachedFile() {
      attachedFile = null;
      if (fileInput) fileInput.value = '';
      if (statusText) {
        statusText.innerText = '선택된 파일 없음';
        statusText.style.color = '#868e96';
      }
      if (previewContainer) {
        previewContainer.innerHTML = '';
        previewContainer.style.display = 'none';
      }
    }

    function handleFile(file) {
      if (!file) return;

      const isImage = file.type.startsWith('image/');
      const isText = file.type === 'text/plain' || file.name.endsWith('.txt');
      const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');

      // Auto-fill title if empty or default placeholder
      if (titleInput && (!titleInput.value.trim() || titleInput.value.trim().startsWith('예:'))) {
        const cleanName = file.name.replace(/\.[^/.]+$/, "");
        titleInput.value = cleanName;
      }

      if (isText) {
        const textReader = new FileReader();
        textReader.onload = function(e) {
          if (contentInput && !contentInput.value.trim()) {
            contentInput.value = e.target.result;
          }
        };
        textReader.readAsText(file);
      }

      const reader = new FileReader();
      reader.onload = function(e) {
        const dataUrl = e.target.result;
        const sizeFormatted = (file.size < 1024 * 1024) 
          ? (file.size / 1024).toFixed(1) + ' KB'
          : (file.size / (1024 * 1024)).toFixed(2) + ' MB';

        attachedFile = {
          name: file.name,
          size: sizeFormatted,
          type: file.type || 'application/octet-stream',
          dataUrl: dataUrl,
          isImage: isImage,
          isPdf: isPdf
        };

        if (statusText) {
          statusText.innerText = `선택됨: ${file.name} (${sizeFormatted})`;
          statusText.style.color = '#2b8a3e';
          statusText.style.fontWeight = '500';
        }

        if (previewContainer) {
          previewContainer.innerHTML = `
            <div class="clean-file-selected-bar">
              <div class="clean-file-info">
                <span class="clean-file-name"><i class="la la-file"></i> ${file.name}</span>
                <span class="clean-file-size">${sizeFormatted}</span>
              </div>
              <button type="button" class="btn-clean-file-remove" title="파일 취소">&times;</button>
            </div>
          `;
          previewContainer.style.display = 'block';

          previewContainer.querySelector('.btn-clean-file-remove').addEventListener('click', (ev) => {
            ev.stopPropagation();
            resetAttachedFile();
          });
        }
      };

      reader.readAsDataURL(file);
    }

    if (browseBtn && fileInput) {
      browseBtn.addEventListener('click', async () => {
        if (window.showOpenFilePicker) {
          try {
            const [fileHandle] = await window.showOpenFilePicker({
              multiple: false
            });
            const file = await fileHandle.getFile();
            handleFile(file);
            return;
          } catch (err) {
            if (err.name !== 'AbortError') {
              fileInput.click();
            }
            return;
          }
        }
        fileInput.click();
      });

      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          handleFile(e.target.files[0]);
        }
      });
    }

    function setExistingFile(fileObj) {
      if (!fileObj) {
        resetAttachedFile();
        return;
      }
      attachedFile = fileObj;
      if (statusText) {
        statusText.innerText = `현재 첨부됨: ${fileObj.name} (${fileObj.size || ''})`;
        statusText.style.color = '#2b8a3e';
        statusText.style.fontWeight = '500';
      }
      if (previewContainer) {
        previewContainer.innerHTML = `
          <div class="clean-file-selected-bar">
            <div class="clean-file-info">
              <span class="clean-file-name"><i class="la la-file"></i> ${fileObj.name}</span>
              <span class="clean-file-size">${fileObj.size || ''}</span>
            </div>
            <button type="button" class="btn-clean-file-remove" title="첨부파일 삭제">&times;</button>
          </div>
        `;
        previewContainer.style.display = 'block';

        previewContainer.querySelector('.btn-clean-file-remove').addEventListener('click', (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          resetAttachedFile();
        });
      }
    }

    return {
      getAttachedFile: () => attachedFile,
      resetAttachedFile: resetAttachedFile,
      setExistingFile: setExistingFile
    };
  }

  // Render detail attachment in clean reference format
  function renderDetailAttachment(containerEl, attachment) {
    if (!containerEl) return;
    if (!attachment || !attachment.dataUrl) {
      containerEl.innerHTML = '';
      containerEl.style.display = 'none';
      return;
    }

    let imagePreviewHtml = '';
    if (attachment.isImage) {
      imagePreviewHtml = `
        <div style="margin-bottom: 15px; text-align: center;">
          <img src="${attachment.dataUrl}" alt="${attachment.name}" style="max-width: 100%; max-height: 400px; border-radius: 4px; border: 1px solid #eee;">
        </div>
      `;
    }

    containerEl.innerHTML = `
      ${imagePreviewHtml}
      <div class="ref-download-guide">첨부된 자료는 아래 파일을 다운로드하세요.</div>
      <a href="${attachment.dataUrl}" download="${attachment.name}" class="ref-download-bar" title="클릭하여 다운로드">
        <div class="ref-download-left">
          <span class="ref-download-bullet">•</span>
          <div class="ref-download-meta">
            <div class="ref-download-name">${attachment.name}</div>
            <div class="ref-download-size">${attachment.size || ''}</div>
          </div>
        </div>
        <i class="la la-arrow-down ref-download-icon"></i>
      </a>
    `;
    containerEl.style.display = 'block';
  }

  // --- D. Church Notice, Jubo & Photo Gallery Board Logic (news.html) ---
  const juboListBody = document.getElementById('jubo-list-body');
  if (juboListBody) {
    const newsModalWrite = document.getElementById('news-write-modal');
    const newsModalDetail = document.getElementById('news-detail-modal');
    const newsModalTitle = document.getElementById('news-write-modal-title');
    const btnSubmitNewsForm = document.getElementById('btn-submit-news-form');
    const deleteConfirmModal = document.getElementById('delete-confirm-modal');
    const btnCancelDelete = document.getElementById('btn-cancel-delete');
    const btnConfirmDelete = document.getElementById('btn-confirm-delete');
    const deleteConfirmBackdrop = document.getElementById('delete-confirm-backdrop');
    const btnDeleteNewsDetail = document.getElementById('btn-delete-news-detail');
    const btnEditNewsDetail = document.getElementById('btn-edit-news-detail');

    const btnOpenNewsWrite = document.getElementById('btn-open-news-modal');
    const btnCloseNewsWrite = document.getElementById('btn-close-news-write');
    const btnCancelNewsWrite = document.getElementById('btn-cancel-news-write');
    const btnCloseNewsDetail = document.getElementById('btn-close-news-detail');
    const btnConfirmNewsDetail = document.getElementById('btn-confirm-news-detail');
    const newsWriteForm = document.getElementById('news-write-form');
    const filterTabBtns = document.querySelectorAll('#news-tab-filters .filter-btn');
    const tableWrapper = document.getElementById('news-table-wrapper');
    const galleryWrapper = document.getElementById('photo-gallery-grid-wrapper');
    const galleryGrid = document.getElementById('photo-gallery-grid');

    let currentOpenDetailId = null;
    let pendingDeleteId = null;
    let editingPostId = null;

    const newsUploader = setupFileUpload(
      'btn-browse-news-file',
      'news-file-input',
      'news-file-status',
      'news-file-preview-container',
      'news-title',
      'news-content'
    );

    let newsData = getBoardData('news_posts_v3', defaultNews);

    // Sanitize any data to guarantee category and author exist
    newsData = newsData.map(item => {
      let cat = item.category;
      if (!cat) {
        const titleLower = (item.title || '').toLowerCase();
        if (titleLower.includes('주보') || titleLower.includes('순서지')) {
          cat = 'jubo';
        } else if (titleLower.includes('사진') || titleLower.includes('수련회') || titleLower.includes('스케치') || (item.file && item.file.isImage)) {
          cat = 'gallery';
        } else {
          cat = 'news';
        }
      }
      return {
        ...item,
        category: cat,
        author: item.author || (cat === 'gallery' ? '미디어팀' : (cat === 'jubo' ? '예배부' : '교회 행정실'))
      };
    });
    saveBoardData('news_posts_v3', newsData);

    // Initial Active Tab resolution (supports URL parameters ?tab=news, ?tab=jubo, ?tab=gallery or hash)
    let currentNewsTab = 'all';
    const urlParams = new URLSearchParams(window.location.search);
    const initialTab = urlParams.get('tab');
    if (initialTab && ['news', 'jubo', 'gallery', 'all'].includes(initialTab)) {
      currentNewsTab = initialTab;
    } else if (window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      if (['news', 'jubo', 'gallery'].includes(hash)) {
        currentNewsTab = hash;
      }
    }

    function getCategoryKoName(cat) {
      switch(cat) {
        case 'news': return '교회소식';
        case 'jubo': return '주보';
        case 'gallery': return '포토갤러리';
        default: return '교회소식';
      }
    }

    function openDetail(item) {
      currentOpenDetailId = item.id;
      const cat = item.category || 'news';
      document.getElementById('news-detail-title').innerText = item.title;
      document.getElementById('news-detail-category').innerHTML = `<i class="la la-tag"></i> 구분: ${getCategoryKoName(cat)}`;
      document.getElementById('news-detail-author').innerHTML = `<i class="la la-user"></i> 작성자: ${item.author || '관리자'}`;
      document.getElementById('news-detail-date').innerHTML = `<i class="la la-calendar"></i> 작성일자: ${item.date}`;
      document.getElementById('news-detail-body').innerText = item.content || (item.file ? '' : '상세 내용이 없습니다.');
      renderDetailAttachment(document.getElementById('news-detail-attachment'), item.file);
      openModal(newsModalDetail);
    }

    function requestDelete(id) {
      pendingDeleteId = id;
      if (deleteConfirmModal) {
        openModal(deleteConfirmModal);
      } else {
        if (confirm('정말 이 글을 삭제하시겠습니까?\n[확인]을 누르면 삭제되고, [취소]를 누르면 유지됩니다.')) {
          executeDelete(id);
        }
      }
    }

    function executeDelete(id) {
      newsData = newsData.filter(p => String(p.id) !== String(id));
      saveBoardData('news_posts_v3', newsData);
      if (deleteConfirmModal) closeModal(deleteConfirmModal);
      if (newsModalDetail) closeModal(newsModalDetail);
      pendingDeleteId = null;
      currentOpenDetailId = null;
      renderNews();
    }

    if (btnConfirmDelete) {
      btnConfirmDelete.addEventListener('click', () => {
        if (pendingDeleteId !== null) {
          executeDelete(pendingDeleteId);
        }
      });
    }

    if (btnCancelDelete) {
      btnCancelDelete.addEventListener('click', () => {
        pendingDeleteId = null;
        if (deleteConfirmModal) closeModal(deleteConfirmModal);
      });
    }

    if (deleteConfirmBackdrop) {
      deleteConfirmBackdrop.addEventListener('click', () => {
        pendingDeleteId = null;
        if (deleteConfirmModal) closeModal(deleteConfirmModal);
      });
    }

    if (btnDeleteNewsDetail) {
      btnDeleteNewsDetail.addEventListener('click', () => {
        if (currentOpenDetailId !== null) {
          requestDelete(currentOpenDetailId);
        }
      });
    }

    // 수정 버튼 클릭 시 기존 내용 및 첨부파일을 폼에 불러와 수정 모드 실행
    if (btnEditNewsDetail) {
      btnEditNewsDetail.addEventListener('click', () => {
        if (currentOpenDetailId === null) return;
        const item = newsData.find(p => String(p.id) === String(currentOpenDetailId));
        if (!item) return;

        editingPostId = item.id;
        closeModal(newsModalDetail);

        if (newsModalTitle) {
          newsModalTitle.innerHTML = '<i class="la la-edit"></i> 게시글 수정';
        }
        if (btnSubmitNewsForm) {
          btnSubmitNewsForm.innerText = '수정 완료';
        }

        document.getElementById('news-title').value = item.title;
        document.getElementById('news-category').value = item.category || 'news';
        document.getElementById('news-author').value = item.author || '관리자';
        document.getElementById('news-date').value = item.date;
        document.getElementById('news-content').value = item.content || '';

        newsUploader.setExistingFile(item.file);
        openModal(newsModalWrite);
      });
    }

    function renderNews() {
      // 1. Update filter tab button active state
      filterTabBtns.forEach(btn => {
        if (btn.dataset.filter === currentNewsTab) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      const filtered = newsData.filter(item => {
        const cat = item.category || 'news';
        if (currentNewsTab === 'all') return true;
        return cat === currentNewsTab;
      });

      if (currentNewsTab === 'gallery') {
        // Show Photo Gallery Grid
        if (tableWrapper) tableWrapper.style.display = 'none';
        if (galleryWrapper) galleryWrapper.style.display = 'block';
        if (galleryGrid) {
          galleryGrid.innerHTML = '';
          if (filtered.length === 0) {
            galleryGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 60px; color: var(--color-text-muted);">등록된 사진이 없습니다. [글쓰기] 버튼을 눌러 새 사진을 등록해 보세요.</div>`;
            return;
          }

          filtered.slice().sort((a, b) => b.id - a.id).forEach(item => {
            const card = document.createElement('div');
            card.className = 'gallery-card';
            
            const thumbImg = item.file && item.file.isImage && item.file.dataUrl
              ? item.file.dataUrl
              : 'assets/church-banner.png';
            
            card.innerHTML = `
              <div class="gallery-card-thumb">
                <img src="${thumbImg}" alt="${item.title}" loading="lazy">
                <span class="gallery-card-badge"><i class="la la-image"></i> 포토갤러리</span>
                <button type="button" class="gallery-card-delete-btn" title="사진 삭제" data-id="${item.id}">
                  <i class="la la-trash"></i>
                </button>
              </div>
              <div class="gallery-card-content">
                <div>
                  <h3 class="gallery-card-title">${item.title}</h3>
                  <p class="gallery-card-desc">${item.content || '사진을 클릭하여 원본을 확인하고 다운로드하세요.'}</p>
                </div>
                <div class="gallery-card-meta">
                  <span class="gallery-card-author"><i class="la la-user"></i> ${item.author || '미디어팀'}</span>
                  <span class="gallery-card-date">${item.date}</span>
                </div>
              </div>
            `;

            card.addEventListener('click', () => {
              openDetail(item);
            });

            const delBtn = card.querySelector('.gallery-card-delete-btn');
            if (delBtn) {
              delBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                requestDelete(item.id);
              });
            }

            galleryGrid.appendChild(card);
          });
        }
      } else {
        // Show Table List for all / news / jubo
        if (galleryWrapper) galleryWrapper.style.display = 'none';
        if (tableWrapper) tableWrapper.style.display = 'block';
        juboListBody.innerHTML = '';

        if (filtered.length === 0) {
          juboListBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--color-text-muted);">등록된 게시글이 없습니다.</td></tr>`;
          return;
        }

        const pinnedPosts = filtered.filter(p => p.isPinned);
        const normalPosts = filtered.filter(p => !p.isPinned).sort((a, b) => b.id - a.id);
        const allSortedPosts = [...pinnedPosts, ...normalPosts];

        allSortedPosts.forEach((item) => {
          const tr = document.createElement('tr');
          const cat = item.category || 'news';
          
          let noContent = '';
          if (item.isPinned) {
            tr.classList.add('pinned-row');
            noContent = `<i class="la la-flag"></i>`;
          } else {
            noContent = item.id;
          }

          const clipBadge = item.file ? `<i class="la la-paperclip" style="color: var(--color-thelight-green); margin-left: 6px; font-weight: bold;" title="첨부자료 있음"></i>` : '';
          
          tr.innerHTML = `
            <td class="col-no">${noContent}</td>
            <td class="col-dept" style="text-align: center;"><span class="badge badge-${cat}">${getCategoryKoName(cat)}</span></td>
            <td class="col-title" style="padding-left: 20px;">${item.title}${clipBadge}</td>
            <td class="col-author" style="text-align: center; font-weight: 500;">${item.author || '관리자'}</td>
            <td class="col-date">${item.date}</td>
            <td class="col-action">
              <button class="btn-delete" data-id="${item.id}" title="삭제"><i class="la la-trash"></i></button>
            </td>
          `;

          tr.querySelector('.col-title').addEventListener('click', () => {
            openDetail(item);
          });

          const trDelBtn = tr.querySelector('.btn-delete');
          if (trDelBtn) {
            trDelBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              requestDelete(item.id);
            });
          }

          juboListBody.appendChild(tr);
        });
      }
    }

    if (btnOpenNewsWrite) {
      btnOpenNewsWrite.addEventListener('click', () => {
        editingPostId = null;
        newsWriteForm.reset();
        if (newsModalTitle) {
          newsModalTitle.innerHTML = '<i class="la la-edit"></i> 게시글 등록';
        }
        if (btnSubmitNewsForm) {
          btnSubmitNewsForm.innerText = '등록하기';
        }
        document.getElementById('news-date').value = new Date().toISOString().substring(0, 10);
        if (currentNewsTab !== 'all' && document.getElementById('news-category')) {
          document.getElementById('news-category').value = currentNewsTab;
        }
        document.getElementById('news-author').value = currentNewsTab === 'gallery' ? '미디어팀' : '교회 행정실';
        newsUploader.resetAttachedFile();
        openModal(newsModalWrite);
      });
    }

    if (btnCloseNewsWrite) btnCloseNewsWrite.addEventListener('click', () => closeModal(newsModalWrite));
    if (btnCancelNewsWrite) btnCancelNewsWrite.addEventListener('click', () => closeModal(newsModalWrite));
    if (btnCloseNewsDetail) btnCloseNewsDetail.addEventListener('click', () => closeModal(newsModalDetail));
    if (btnConfirmNewsDetail) btnConfirmNewsDetail.addEventListener('click', () => closeModal(newsModalDetail));

    document.getElementById('news-write-backdrop').addEventListener('click', () => closeModal(newsModalWrite));
    document.getElementById('news-detail-backdrop').addEventListener('click', () => closeModal(newsModalDetail));

    newsWriteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('news-title').value.trim();
      const category = document.getElementById('news-category').value;
      const author = document.getElementById('news-author').value.trim() || '관리자';
      const date = document.getElementById('news-date').value;
      const content = document.getElementById('news-content').value.trim();
      const attachedFile = newsUploader.getAttachedFile();

      if (editingPostId !== null) {
        // 수정 모드 (기존 데이터 업데이트)
        const index = newsData.findIndex(p => String(p.id) === String(editingPostId));
        if (index !== -1) {
          newsData[index] = {
            ...newsData[index],
            title: title,
            category: category,
            author: author,
            date: date,
            content: content,
            file: attachedFile
          };
        }
        editingPostId = null;
      } else {
        // 신규 등록 모드
        const normalPosts = newsData.filter(p => !p.isPinned);
        const nextId = normalPosts.length > 0 ? Math.max(...normalPosts.map(p => p.id)) + 1 : 305;

        const newPost = {
          id: nextId,
          title: title,
          category: category,
          author: author,
          date: date,
          content: content,
          file: attachedFile
        };

        newsData.unshift(newPost);
      }

      saveBoardData('news_posts_v3', newsData);
      closeModal(newsModalWrite);
      renderNews();
    });

    filterTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        currentNewsTab = btn.dataset.filter;
        renderNews();
      });
    });

    renderNews();
  }

  // --- E. Church School Notice Board Logic (school.html) ---
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

    const schoolUploader = setupFileUpload(
      'btn-browse-school-file',
      'school-file-input',
      'school-file-status',
      'school-file-preview-container',
      'school-title',
      'school-content'
    );

    let schoolData = getBoardData('school_posts', defaultSchool);
    let currentFilter = 'all';

    function getDeptKoName(dept) {
      switch(dept) {
        case 'kids': return '유초등부';
        case 'hero': return '중고등부';
        case 'kfc': return '축구동아리';
        default: return '공통';
      }
    }

    function renderSchool() {
      schoolListBody.innerHTML = '';
      const filteredData = schoolData.filter(item => currentFilter === 'all' || item.dept === currentFilter);

      if (filteredData.length === 0) {
        schoolListBody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align: center; padding: 40px; color: var(--color-text-muted);">
              등록된 공지사항이 없습니다.
            </td>
          </tr>
        `;
        return;
      }

      filteredData.slice().reverse().forEach((item, index) => {
        const tr = document.createElement('tr');
        const clipBadge = item.file ? `<i class="la la-paperclip" style="color: var(--color-primary); margin-left: 6px; font-weight: bold;" title="첨부자료 있음"></i>` : '';
        
        tr.innerHTML = `
          <td class="col-no" style="text-align: left;">${filteredData.length - index}</td>
          <td class="col-dept" style="text-align: center;"><span class="badge badge-${item.dept}">${getDeptKoName(item.dept)}</span></td>
          <td class="col-title" style="text-align: left; padding-left: 20px;">${item.title}${clipBadge}</td>
          <td class="col-author" style="text-align: center; font-weight: 500;">${item.author}</td>
          <td class="col-date" style="text-align: right;">${item.date}</td>
          <td class="col-action">
            <button class="btn-delete" data-id="${item.id}"><i class="la la-trash"></i></button>
          </td>
        `;

        tr.querySelector('.col-title').addEventListener('click', () => {
          document.getElementById('school-detail-title').innerText = item.title;
          document.getElementById('school-detail-dept').innerHTML = `<i class="la la-tag"></i> 부서: ${getDeptKoName(item.dept)}`;
          document.getElementById('school-detail-author').innerHTML = `<i class="la la-user"></i> 작성자: ${item.author}`;
          document.getElementById('school-detail-date').innerHTML = `<i class="la la-calendar"></i> 날짜: ${item.date}`;
          document.getElementById('school-detail-body').innerText = item.content || (item.file ? '' : '상세 내용이 없습니다.');
          renderDetailAttachment(document.getElementById('school-detail-attachment'), item.file);
          openModal(schoolModalDetail);
        });

        tr.querySelector('.btn-delete').addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm('이 글을 삭제하시겠습니까?')) {
            schoolData = schoolData.filter(p => p.id !== item.id);
            saveBoardData('school_posts', schoolData);
            renderSchool();
          }
        });

        schoolListBody.appendChild(tr);
      });
    }

    if (btnOpenSchoolWrite) {
      btnOpenSchoolWrite.addEventListener('click', () => {
        schoolWriteForm.reset();
        schoolUploader.resetAttachedFile();
        openModal(schoolModalWrite);
      });
    }

    if (btnCloseSchoolWrite) btnCloseSchoolWrite.addEventListener('click', () => closeModal(schoolModalWrite));
    if (btnCancelSchoolWrite) btnCancelSchoolWrite.addEventListener('click', () => closeModal(schoolModalWrite));
    if (btnCloseSchoolDetail) btnCloseSchoolDetail.addEventListener('click', () => closeModal(schoolModalDetail));
    if (btnConfirmSchoolDetail) btnConfirmSchoolDetail.addEventListener('click', () => closeModal(schoolModalDetail));

    document.getElementById('school-write-backdrop').addEventListener('click', () => closeModal(schoolModalWrite));
    document.getElementById('school-detail-backdrop').addEventListener('click', () => closeModal(schoolModalDetail));

    schoolWriteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('school-title').value.trim();
      const dept = document.getElementById('school-dept').value;
      const author = document.getElementById('school-author').value.trim();
      const content = document.getElementById('school-content').value.trim();
      const attachedFile = schoolUploader.getAttachedFile();

      const nextId = schoolData.length > 0 ? Math.max(...schoolData.map(p => p.id)) + 1 : 1;

      const newPost = {
        id: nextId,
        title: title,
        dept: dept,
        author: author,
        date: new Date().toISOString().substring(0, 10),
        content: content,
        file: attachedFile
      };

      schoolData.push(newPost);
      saveBoardData('school_posts', schoolData);
      closeModal(schoolModalWrite);
      renderSchool();
    });

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderSchool();
      });
    });

  }
});

// 7. Copy Bank Account Number Helper Function
window.copyAccount = function(customNum) {
  const text = customNum || (document.getElementById('account-number') ? document.getElementById('account-number').innerText.trim() : '');
  if (text) {
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
