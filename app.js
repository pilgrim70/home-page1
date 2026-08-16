document.addEventListener('DOMContentLoaded', async () => {
  
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

  // -- Lightbox Implementation --
  const lightboxOverlay = document.createElement('div');
  lightboxOverlay.id = 'lightbox-overlay';
  document.body.appendChild(lightboxOverlay);

  const lightboxImg = document.createElement('img');
  lightboxOverlay.appendChild(lightboxImg);

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('lightbox-img')) {
      lightboxImg.src = e.target.src;
      lightboxOverlay.classList.add('show');
    } else if (e.target === lightboxOverlay || e.target === lightboxImg) {
      lightboxOverlay.classList.remove('show');
      setTimeout(() => { lightboxImg.src = ''; }, 300);
    }
  });

  // --- Admin Configuration & System ---
  const ADMINS = [
    { name: '송기운', password: '20114!', role: 'main' },
    { name: '정해단', password: '1231!', role: 'sub' },
    { name: '민병희', password: '1231!', role: 'sub' }
  ];

  function getAdminRole() {
    return localStorage.getItem('adminRole');
  }

  function getAdminName() {
    return localStorage.getItem('adminName');
  }

  function isAdmin() {
    return getAdminRole() === 'main' || getAdminRole() === 'sub';
  }

  function loginAdmin(name, password) {
    const admin = ADMINS.find(a => a.name === name && a.password === password);
    if (admin) {
      localStorage.setItem('adminRole', admin.role);
      localStorage.setItem('adminName', admin.name);
      applyAdminPermissions();
      return true;
    }
    return false;
  }

  function logoutAdmin() {
    localStorage.removeItem('adminRole');
    localStorage.removeItem('adminName');
    applyAdminPermissions();
  }

  function applyAdminPermissions() {
    if (isAdmin()) {
      document.body.classList.add('is-manager');
    } else {
      document.body.classList.remove('is-manager');
    }
  }

  // --- Admin UI Rendering ---
  function initAdminUI() {
    const adminStyle = document.createElement('style');
    adminStyle.innerHTML = `
      .manager-only, .manager-only-flex, .manager-only-inline { display: none !important; }
      body.is-manager .manager-only { display: block !important; }
      body.is-manager .manager-only-flex { display: flex !important; }
      body.is-manager .manager-only-inline { display: inline-block !important; }

      #manager-icon-btn {
        position: fixed;
        right: 20px;
        bottom: 90px;
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background-color: #ffeb3b; /* bright yellow */
        color: #000; /* black text for contrast */
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 30px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.6);
        cursor: pointer;
        z-index: 999999;
        transition: transform 0.2s;
        border: 4px solid #fff;
        animation: pulse 2s infinite;
      }
      @keyframes pulse {
        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 235, 59, 0.7); }
        70% { transform: scale(1.1); box-shadow: 0 0 0 15px rgba(255, 235, 59, 0); }
        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 235, 59, 0); }
      }
      #manager-icon-btn span {
        font-size: 13px;
        margin-top: 2px;
        font-weight: 900;
        letter-spacing: 1px;
      }
      #manager-icon-btn:hover { transform: scale(1.15); animation: none; }
      
      #manager-modal {
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.6);
        z-index: 10000;
        display: none;
        align-items: center;
        justify-content: center;
      }
      #manager-modal.show { display: flex; }
      
      .manager-modal-content {
        background: white;
        padding: 30px;
        border-radius: 10px;
        width: 300px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      }
      .manager-modal-content h3 { margin-top:0; margin-bottom: 20px; color: var(--color-primary); }
      .manager-modal-content input {
        width: 100%; padding: 10px; margin-bottom: 15px;
        border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box;
      }
      .manager-modal-actions { display: flex; gap: 10px; justify-content: flex-end; }
    `;
    document.head.appendChild(adminStyle);

    const btn = document.createElement('button');
    btn.id = 'manager-icon-btn';
    btn.innerHTML = '<i class="la la-user-shield"></i><span>관리자</span>';
    document.body.appendChild(btn);

    const modal = document.createElement('div');
    modal.id = 'manager-modal';
    modal.innerHTML = `
      <div class="manager-modal-content">
        <h3 id="manager-modal-title">관리자 로그인</h3>
        <div id="manager-login-form">
          <input type="text" id="manager-name" placeholder="이름 (예: 송기운)">
          <input type="password" id="manager-password" placeholder="비밀번호">
          <div class="manager-modal-actions">
            <button class="btn btn-secondary" id="manager-close-btn">취소</button>
            <button class="btn btn-primary" id="manager-submit-btn">로그인</button>
          </div>
        </div>
        <div id="manager-logout-form" style="display:none;">
          <p style="margin-bottom:20px;">현재 <strong id="manager-current-name"></strong> 관리자로 로그인되어 있습니다.</p>
          <div class="manager-modal-actions">
            <button class="btn btn-secondary" id="manager-close-btn-2">닫기</button>
            <button class="btn btn-danger" id="manager-logout-btn">로그아웃</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const loginForm = modal.querySelector('#manager-login-form');
    const logoutForm = modal.querySelector('#manager-logout-form');

    function updateModalUI() {
      if (isAdmin()) {
        loginForm.style.display = 'none';
        logoutForm.style.display = 'block';
        modal.querySelector('#manager-modal-title').textContent = '관리자 메뉴';
        modal.querySelector('#manager-current-name').textContent = getAdminName();
      } else {
        loginForm.style.display = 'block';
        logoutForm.style.display = 'none';
        modal.querySelector('#manager-modal-title').textContent = '관리자 로그인';
      }
    }

    btn.addEventListener('click', () => {
      updateModalUI();
      modal.classList.add('show');
    });

    const footerAdminLogin = document.getElementById('footer-admin-login');
    if (footerAdminLogin) {
      footerAdminLogin.addEventListener('click', (e) => {
        e.preventDefault();
        updateModalUI();
        modal.classList.add('show');
      });
    }

    modal.querySelector('#manager-close-btn').addEventListener('click', () => modal.classList.remove('show'));
    modal.querySelector('#manager-close-btn-2').addEventListener('click', () => modal.classList.remove('show'));
    
    modal.querySelector('#manager-submit-btn').addEventListener('click', () => {
      const name = modal.querySelector('#manager-name').value.trim();
      const pwd = modal.querySelector('#manager-password').value;
      if (loginAdmin(name, pwd)) {
        alert('로그인 성공!');
        modal.classList.remove('show');
        location.reload(); 
      } else {
        alert('이름 또는 비밀번호가 일치하지 않습니다.');
      }
    });

    modal.querySelector('#manager-logout-btn').addEventListener('click', () => {
      logoutAdmin();
      alert('로그아웃 되었습니다.');
      modal.classList.remove('show');
      location.reload();
    });

    applyAdminPermissions();
  }
  
  initAdminUI();

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

  // --- Supabase Configuration ---
  const SUPABASE_URL = 'https://puvkinmuzvgqafxvqwnj.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_RJ1VLpvyS0Wb-bxg3I7WAg_yutuzcJu';
  const isSupabaseEnabled = SUPABASE_URL !== 'YOUR_SUPABASE_URL_HERE';
  let supabaseClient = null;
  if (isSupabaseEnabled && window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }

  // LocalStorage key
  const SERMON_STORAGE_KEY = 'sermon_posts_v2';

  async function getSermonData() {
    if (isSupabaseEnabled && supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('sermons_v2').select('*').order('date', { ascending: false });
        if (!error && data) return data;
      } catch (e) {
        console.error('Supabase fetch error:', e);
      }
    }
    // Fallback to LocalStorage
    let data = localStorage.getItem(SERMON_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(SERMON_STORAGE_KEY, JSON.stringify(defaultSermons));
      return [...defaultSermons];
    }
    return JSON.parse(data);
  }

  async function saveSermonData(data) {
    if (isSupabaseEnabled && supabaseClient) {
      try {
        await supabaseClient.from('sermons_v2').upsert(data);
      } catch (e) {
        console.error('Supabase save error:', e);
      }
    }
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
  const editBtn = document.getElementById('sermon-edit-btn');
  if (editBtn) {
    editBtn.classList.add('manager-only-inline');
    editBtn.addEventListener('click', async () => {
      if (currentSermonDetailId === null) return;
      const sermons = await getSermonData();
      const item = sermons.find(s => s.id === currentSermonDetailId);
      if (!item) return;
      closeSermonDetail();
      openSermonWrite(item); // open in edit mode
    });
  }

  // Delete button in detail modal
  const deleteBtn = document.getElementById('sermon-delete-btn');
  if (deleteBtn) {
    deleteBtn.classList.add('manager-only-inline');
    deleteBtn.addEventListener('click', async () => {
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
    deleteOkBtn.addEventListener('click', async () => {
      if (pendingDeleteSermonId !== null) {
        let sermons = await getSermonData();
        sermons = sermons.filter(s => s.id !== pendingDeleteSermonId);
        await saveSermonData(sermons);
        closeDeleteConfirm();
        closeSermonDetail();
        await renderSermonPlaylist();
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
    sermonWriteForm.addEventListener('submit', async (e) => {
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

      let sermons = await getSermonData();

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

      await saveSermonData(sermons);
      closeSermonWrite();
      await renderSermonPlaylist();
    });
  }

  // -- Render Sermon Playlist --
  let currentSermonTab = 'all';

  const sermonTabFilters = document.querySelectorAll('#sermon-tab-filters .filter-btn');
  if (sermonTabFilters.length > 0) {
    sermonTabFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        currentSermonTab = btn.dataset.filter;
        sermonTabFilters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderSermonPlaylist();
      });
    });
  }

  async function renderSermonPlaylist() {
    if (!sermonPlaylistContainer) return;
    const allSermons = await getSermonData();
    
    // Filter by currentSermonTab
    const sermons = allSermons.filter(s => currentSermonTab === 'all' || s.series === currentSermonTab);

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

  // 스크립트가 정상적으로 실행된 경우에만 애니메이션 대기 상태를 적용한다.
  // 오류나 미지원 브라우저에서도 본문 콘텐츠는 그대로 표시된다.
  if ('IntersectionObserver' in window) {
    revealElements.forEach(el => el.classList.add('reveal-pending'));
    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    revealElements.forEach(el => revealObserver.observe(el));
  }

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
      id: 305,
      title: '2026년 8월 새가족 환영식 및 등록 성도 기념사진',
      category: 'gallery_newfamily',
      author: '새가족부',
      date: '2026-08-10',
      content: '복의근원 관유중앙교회의 귀한 새 식구가 되신 성도님들을 예수님의 사랑으로 온 맘 다해 환영합니다.',
      file: {
        name: 'new_family_welcome_2026.png',
        size: '890 KB',
        type: 'image/png',
        dataUrl: 'assets/church-banner.png',
        isImage: true
      }
    },
    {
      id: 304,
      title: '2026 전교인 여름 수련회 은혜의 현장 사진 스케치',
      category: 'gallery_event',
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
      category: 'gallery_event',
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
      category: 'gallery_school',
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
  async function getBoardData(key, defaultData) {
    if (isSupabaseEnabled && supabaseClient) {
      try {
        // Assume table name matches key
        const { data, error } = await supabaseClient.from(key).select('*').order('date', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.error('Supabase fetch error for ' + key + ':', e);
      }
    }
    // Fallback to LocalStorage
    let data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(data);
  }

  async function saveBoardData(key, data) {
    if (isSupabaseEnabled && supabaseClient) {
      try {
        await supabaseClient.from(key).upsert(data);
      } catch (e) {
        console.error('Supabase save error for ' + key + ':', e);
      }
    }
    // Fallback to LocalStorage
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('localStorage save warning (QuotaExceededError):', e);
      try {
        // Clear heavy base64 dataUrl images from old items if quota is exceeded
        const cleaned = data.map((item, index) => {
          if (index > 1 && item.file && item.file.dataUrl && item.file.dataUrl.length > 50000) {
            return {
              ...item,
              file: {
                ...item.file,
                dataUrl: 'assets/church-banner.png'
              }
            };
          }
          return item;
        });
        localStorage.setItem(key, JSON.stringify(cleaned));
      } catch (e2) {
        console.error('Failed to save to localStorage even after cleaning:', e2);
      }
    }
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
        const rawDataUrl = e.target.result;

        if (isImage) {
          const img = new Image();
          img.onload = function() {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1000;
            const MAX_HEIGHT = 1000;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height = Math.round((height * MAX_WIDTH) / width);
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width = Math.round((width * MAX_HEIGHT) / height);
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.75);
            const sizeKb = (compressedDataUrl.length / 1024).toFixed(1) + ' KB';

            attachedFile = {
              name: file.name,
              size: sizeKb,
              type: 'image/jpeg',
              dataUrl: compressedDataUrl,
              isImage: true,
              isPdf: false
            };

            if (statusText) {
              statusText.innerText = `선택됨: ${file.name} (${sizeKb})`;
              statusText.style.color = '#2b8a3e';
              statusText.style.fontWeight = '500';
            }

            if (previewContainer) {
              previewContainer.innerHTML = `
                <div class="clean-file-selected-bar">
                  <div class="clean-file-info">
                    <span class="clean-file-name"><i class="la la-file"></i> ${file.name}</span>
                    <span class="clean-file-size">${sizeKb}</span>
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
          img.src = rawDataUrl;
        } else {
          const sizeFormatted = (file.size < 1024 * 1024) 
            ? (file.size / 1024).toFixed(1) + ' KB'
            : (file.size / (1024 * 1024)).toFixed(2) + ' MB';

          attachedFile = {
            name: file.name,
            size: sizeFormatted,
            type: file.type || 'application/octet-stream',
            dataUrl: rawDataUrl,
            isImage: false,
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
          <img src="${attachment.dataUrl}" alt="${attachment.name}" class="lightbox-img" style="max-width: 100%; max-height: 400px; border-radius: 4px; border: 1px solid #eee; cursor: zoom-in;">
        </div>
      `;
    }

    containerEl.innerHTML = `
      ${imagePreviewHtml}
      <div class="manager-only">
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
      </div>
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

    let newsData = await getBoardData('news_posts_v4', defaultNews);

    // Sanitize any data to guarantee category and author exist
    newsData = newsData.map(item => {
      let cat = item.category;
      if (!cat || cat === 'gallery') {
        const titleLower = (item.title || '').toLowerCase();
        if (titleLower.includes('주보') || titleLower.includes('순서지')) {
          cat = 'jubo';
        } else if (titleLower.includes('학교') || titleLower.includes('어린이') || titleLower.includes('유치') || titleLower.includes('초등') || titleLower.includes('중고등')) {
          cat = 'gallery_school';
        } else if (titleLower.includes('새가족') || titleLower.includes('환영') || titleLower.includes('등록')) {
          cat = 'gallery_newfamily';
        } else if (titleLower.includes('사진') || titleLower.includes('수련회') || titleLower.includes('스케치') || (item.file && item.file.isImage)) {
          cat = 'gallery_event';
        } else {
          cat = 'news';
        }
      }
      return {
        ...item,
        category: cat,
        author: item.author || (cat.startsWith('gallery') ? '미디어팀' : (cat === 'jubo' ? '예배부' : '교회 행정실'))
      };
    });
    await saveBoardData('news_posts_v4', newsData);

    // Initial Active Tab resolution (supports URL parameters ?tab=news, ?tab=jubo, ?tab=gallery & ?sub=school/event/newfamily)
    let currentNewsTab = 'all';
    let currentGallerySubTab = 'all';

    const urlParams = new URLSearchParams(window.location.search);
    const initialTab = urlParams.get('tab');
    const initialSub = urlParams.get('sub');

    if (initialTab && ['news', 'jubo', 'gallery', 'all', 'gallery_school', 'gallery_event', 'gallery_newfamily'].includes(initialTab)) {
      if (initialTab.startsWith('gallery_')) {
        currentNewsTab = 'gallery';
        currentGallerySubTab = initialTab;
      } else {
        currentNewsTab = initialTab;
      }
    } else if (window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      if (['news', 'jubo', 'gallery'].includes(hash)) {
        currentNewsTab = hash;
      }
    }

    if (initialSub) {
      if (initialSub === 'school') currentGallerySubTab = 'gallery_school';
      else if (initialSub === 'event') currentGallerySubTab = 'gallery_event';
      else if (initialSub === 'newfamily') currentGallerySubTab = 'gallery_newfamily';
    }

    function getCategoryKoName(cat) {
      switch(cat) {
        case 'news': return '교회소식';
        case 'jubo': return '주보';
        case 'gallery': return '포토갤러리';
        case 'gallery_school': return '포토: 주일학교';
        case 'gallery_event': return '포토: 교회행사';
        case 'gallery_newfamily': return '포토: 새가족등록';
        default: return '교회소식';
      }
    }

    function getCategoryBadgeHtml(cat) {
      switch(cat) {
        case 'news': return `<span class="badge badge-news">교회소식</span>`;
        case 'jubo': return `<span class="badge badge-jubo">주보</span>`;
        case 'gallery_school': return `<span class="badge badge-gallery_school"><i class="la la-child"></i> 주일학교</span>`;
        case 'gallery_event': return `<span class="badge badge-gallery_event"><i class="la la-calendar-check"></i> 교회행사</span>`;
        case 'gallery_newfamily': return `<span class="badge badge-gallery_newfamily"><i class="la la-user-plus"></i> 새가족등록</span>`;
        default: return `<span class="badge badge-gallery"><i class="la la-image"></i> 포토갤러리</span>`;
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

    async function executeDelete(id) {
      newsData = newsData.filter(p => String(p.id) !== String(id));
      await saveBoardData('news_posts_v4', newsData);
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
      // 1. Update main filter tab button active state
      filterTabBtns.forEach(btn => {
        if (btn.dataset.filter === currentNewsTab) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // 2. Update gallery sub-filter button active state
      const subFilterBtns = document.querySelectorAll('#gallery-sub-filters .sub-filter-btn');
      subFilterBtns.forEach(btn => {
        if (btn.dataset.sub === currentGallerySubTab) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      const isGalleryTab = currentNewsTab === 'gallery' || currentNewsTab.startsWith('gallery_');

      if (isGalleryTab) {
        // Show Photo Gallery Grid
        if (tableWrapper) tableWrapper.style.display = 'none';
        if (galleryWrapper) galleryWrapper.style.display = 'block';

        const filteredGallery = newsData.filter(item => {
          const cat = item.category || 'news';
          if (!cat.startsWith('gallery')) return false;

          if (currentNewsTab !== 'all' && currentNewsTab !== 'gallery') {
            return cat === currentNewsTab;
          }
          if (currentGallerySubTab === 'all') return true;
          return cat === currentGallerySubTab;
        });

        if (galleryGrid) {
          galleryGrid.innerHTML = '';
          
          const createCard = (item) => {
            const card = document.createElement('div');
            card.className = 'gallery-card';
            
            const thumbImg = item.file && item.file.isImage && item.file.dataUrl
              ? item.file.dataUrl
              : 'assets/church-banner.png';

            const cat = item.category || 'gallery_event';
            const badgeHtml = getCategoryBadgeHtml(cat);
            
            card.innerHTML = `
              <div class="gallery-card-thumb">
                <img src="${thumbImg}" alt="${item.title}" loading="lazy">
                <span class="gallery-card-badge">${badgeHtml}</span>
                <button type="button" class="gallery-card-delete-btn manager-only" title="사진 삭제" data-id="${item.id}">
                  <i class="la la-times"></i>
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

            card.addEventListener('click', (e) => {
              if (e.target.closest('.gallery-card-delete-btn')) return;
              openDetail(item);
            });
            return card;
          };

          if (currentGallerySubTab === 'all') {
            const categories = [
              { id: 'gallery_school', title: '주일학교' },
              { id: 'gallery_event', title: '교회행사' },
              { id: 'gallery_newfamily', title: '새가족등록' }
            ];

            categories.forEach(catInfo => {
              const heading = document.createElement('h3');
              heading.className = 'gallery-category-heading';
              heading.innerHTML = `&bull; ${catInfo.title}`;
              heading.style.gridColumn = '1 / -1';
              heading.style.marginTop = '20px';
              heading.style.marginBottom = '-10px';
              heading.style.fontSize = '1.25rem';
              heading.style.fontWeight = 'bold';
              heading.style.color = 'var(--color-primary-dark)';
              heading.style.borderBottom = '1px solid var(--color-border)';
              heading.style.paddingBottom = '8px';
              galleryGrid.appendChild(heading);

              const categoryPhotos = newsData.filter(item => item.category === catInfo.id).sort((a, b) => b.id - a.id);
              
              if (categoryPhotos.length > 0) {
                // 최근 사진 1개만 표시
                const recentItem = categoryPhotos[0];
                galleryGrid.appendChild(createCard(recentItem));
              } else {
                const emptyDiv = document.createElement('div');
                emptyDiv.style.gridColumn = '1 / -1';
                emptyDiv.style.color = 'var(--color-text-muted)';
                emptyDiv.style.padding = '10px 0';
                emptyDiv.textContent = '최근 등록된 사진이 없습니다.';
                galleryGrid.appendChild(emptyDiv);
              }
            });
          } else {
            if (filteredGallery.length === 0) {
              galleryGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 60px; color: var(--color-text-muted);">등록된 사진이 없습니다. <span class="manager-only">[글쓰기] 버튼을 눌러 새 사진을 등록해 보세요.</span></div>`;
              return;
            }

            filteredGallery.slice().sort((a, b) => b.id - a.id).forEach(item => {
              galleryGrid.appendChild(createCard(item));
            });
          }
        }

        // 갤러리 그리드 이벤트 위임 (삭제 버튼 클릭 처리)
        if (galleryGrid && !galleryGrid.dataset.delegated) {
          galleryGrid.dataset.delegated = 'true';
          galleryGrid.addEventListener('click', (e) => {
            const delBtn = e.target.closest('.gallery-card-delete-btn');
            if (delBtn) {
              e.preventDefault();
              e.stopPropagation();
              requestDelete(delBtn.dataset.id);
            }
          });
        }
      } else {
        // Show Table List for all / news / jubo
        if (galleryWrapper) galleryWrapper.style.display = 'none';
        if (tableWrapper) tableWrapper.style.display = 'block';
        juboListBody.innerHTML = '';

        const filtered = newsData.filter(item => {
          const cat = item.category || 'news';
          if (currentNewsTab === 'all') return true;
          return cat === currentNewsTab;
        });

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
            <td class="col-dept" style="text-align: center;">${getCategoryBadgeHtml(cat)}</td>
            <td class="col-title" style="padding-left: 20px;">${item.title}${clipBadge}</td>
            <td class="col-author" style="text-align: center; font-weight: 500;">${item.author || '관리자'}</td>
            <td class="col-date">${item.date}</td>
            <td class="col-action">
              <div class="news-post-actions manager-only-flex">
                <button type="button" class="btn-delete news-post-delete" data-id="${item.id}" title="삭제" aria-label="게시글 삭제"><i class="la la-trash"></i></button>
              </div>
            </td>
          `;

          tr.querySelector('.col-title').addEventListener('click', () => {
            openDetail(item);
          });

          juboListBody.appendChild(tr);
        });
      }
    }

    // 테이블 목록 이벤트 위임 (삭제 버튼 클릭 처리)
    juboListBody.addEventListener('click', (e) => {
      const delBtn = e.target.closest('.news-post-delete');
      if (delBtn) {
        e.preventDefault();
        e.stopPropagation();
        requestDelete(delBtn.dataset.id);
      }
    });

    // 갤러리 서브 필터 버튼 이벤트 처리 (전체 / 주일학교 / 교회행사 / 새가족등록)
    const gallerySubFilterBtns = document.querySelectorAll('#gallery-sub-filters .sub-filter-btn');
    gallerySubFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        currentGallerySubTab = btn.dataset.sub;
        renderNews();
      });
    });

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
        if (document.getElementById('news-category')) {
          if (currentNewsTab.startsWith('gallery') || currentGallerySubTab !== 'all') {
            document.getElementById('news-category').value = currentGallerySubTab !== 'all' ? currentGallerySubTab : 'gallery_event';
          } else if (currentNewsTab !== 'all') {
            document.getElementById('news-category').value = currentNewsTab;
          }
        }
        document.getElementById('news-author').value = currentNewsTab.startsWith('gallery') ? '미디어팀' : '교회 행정실';
        newsUploader.resetAttachedFile();
        openModal(newsModalWrite);
      });
    }

    if (btnCloseNewsWrite) btnCloseNewsWrite.addEventListener('click', () => closeModal(newsModalWrite));
    if (btnCancelNewsWrite) btnCancelNewsWrite.addEventListener('click', () => closeModal(newsModalWrite));
    if (btnCloseNewsDetail) btnCloseNewsDetail.addEventListener('click', () => closeModal(newsModalDetail));
    if (btnConfirmNewsDetail) btnConfirmNewsDetail.addEventListener('click', () => closeModal(newsModalDetail));

    const newsWriteBackdrop = document.getElementById('news-write-backdrop');
    if (newsWriteBackdrop) newsWriteBackdrop.addEventListener('click', () => closeModal(newsModalWrite));
    const newsDetailBackdrop = document.getElementById('news-detail-backdrop');
    if (newsDetailBackdrop) newsDetailBackdrop.addEventListener('click', () => closeModal(newsModalDetail));

    newsWriteForm.addEventListener('submit', async (e) => {
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

      await saveBoardData('news_posts_v4', newsData);
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
    const btnDeleteSchoolDetail = document.getElementById('btn-delete-school-detail');
    const btnEditSchoolDetail = document.getElementById('btn-edit-school-detail');
    const schoolWriteForm = document.getElementById('school-write-form');
    const schoolWriteModalTitle = document.getElementById('school-write-modal-title');
    const btnSubmitSchoolForm = document.getElementById('btn-submit-school-form');
    const filterBtns = document.querySelectorAll('.notice-filters .filter-btn');

    const schoolUploader = setupFileUpload(
      'btn-browse-school-file',
      'school-file-input',
      'school-file-status',
      'school-file-preview-container',
      'school-title',
      'school-content'
    );

    let schoolData = await getBoardData('school_posts_v2', defaultSchool);
    let currentFilter = 'all';
    let currentSchoolDetailId = null;
    let editingSchoolId = null;

    async function deleteSchoolPost(id) {
      schoolData = schoolData.filter(post => String(post.id) !== String(id));
      await saveBoardData('school_posts_v2', schoolData);
      if (String(currentSchoolDetailId) === String(id)) {
        closeModal(schoolModalDetail);
        currentSchoolDetailId = null;
      }
      renderSchool();
    }

    function openSchoolDetail(item) {
      currentSchoolDetailId = item.id;
      document.getElementById('school-detail-title').innerText = item.title;
      document.getElementById('school-detail-dept').innerHTML = `<i class="la la-tag"></i> 부서: ${getDeptKoName(item.dept)}`;
      document.getElementById('school-detail-author').innerHTML = `<i class="la la-user"></i> 작성자: ${item.author}`;
      document.getElementById('school-detail-date').innerHTML = `<i class="la la-calendar"></i> 날짜: ${item.date}`;
      document.getElementById('school-detail-body').innerText = item.content || (item.file ? '' : '상세 내용이 없습니다.');
      renderDetailAttachment(document.getElementById('school-detail-attachment'), item.file);
      openModal(schoolModalDetail);
    }

    function openSchoolWrite(item = null) {
      schoolWriteForm.reset();

      if (item) {
        editingSchoolId = item.id;
        document.getElementById('school-title').value = item.title || '';
        document.getElementById('school-dept').value = item.dept || 'kids';
        document.getElementById('school-author').value = item.author || '';
        document.getElementById('school-content').value = item.content || '';
        schoolUploader.setExistingFile(item.file || null);
        if (schoolWriteModalTitle) schoolWriteModalTitle.innerHTML = '<i class="la la-edit"></i> 교회학교 소식 수정';
        if (btnSubmitSchoolForm) btnSubmitSchoolForm.textContent = '수정 저장';
      } else {
        editingSchoolId = null;
        schoolUploader.resetAttachedFile();
        if (schoolWriteModalTitle) schoolWriteModalTitle.innerHTML = '<i class="la la-edit"></i> 교회학교 소식 등록';
        if (btnSubmitSchoolForm) btnSubmitSchoolForm.textContent = '등록하기';
      }

      openModal(schoolModalWrite);
    }

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
            <div class="school-post-actions manager-only-flex">
              <button type="button" class="btn-delete school-post-delete" data-id="${item.id}" aria-label="게시글 삭제"><i class="la la-trash"></i></button>
            </div>
          </td>
        `;

        tr.querySelector('.col-title').addEventListener('click', () => openSchoolDetail(item));

        schoolListBody.appendChild(tr);
      });
    }

    // 동적으로 다시 그려지는 목록에서도 항상 삭제 버튼이 동작하도록 이벤트를 위임한다.
    schoolListBody.addEventListener('click', (event) => {
      const deleteButton = event.target.closest('.school-post-delete');
      if (!deleteButton) return;

      event.preventDefault();
      event.stopPropagation();
      deleteSchoolPost(deleteButton.dataset.id);
    });

    if (btnOpenSchoolWrite) {
      btnOpenSchoolWrite.addEventListener('click', () => {
        openSchoolWrite();
      });
    }

    if (btnCloseSchoolWrite) btnCloseSchoolWrite.addEventListener('click', () => closeModal(schoolModalWrite));
    if (btnCancelSchoolWrite) btnCancelSchoolWrite.addEventListener('click', () => closeModal(schoolModalWrite));
    if (btnCloseSchoolDetail) btnCloseSchoolDetail.addEventListener('click', () => closeModal(schoolModalDetail));
    if (btnConfirmSchoolDetail) btnConfirmSchoolDetail.addEventListener('click', () => closeModal(schoolModalDetail));
    if (btnDeleteSchoolDetail) btnDeleteSchoolDetail.addEventListener('click', () => {
      if (currentSchoolDetailId !== null) deleteSchoolPost(currentSchoolDetailId);
    });
    if (btnEditSchoolDetail) btnEditSchoolDetail.addEventListener('click', () => {
      const item = schoolData.find(post => String(post.id) === String(currentSchoolDetailId));
      if (!item) return;
      closeModal(schoolModalDetail);
      openSchoolWrite(item);
    });

    const schoolWriteBackdrop = document.getElementById('school-write-backdrop');
    if (schoolWriteBackdrop) schoolWriteBackdrop.addEventListener('click', () => closeModal(schoolModalWrite));
    const schoolDetailBackdrop = document.getElementById('school-detail-backdrop');
    if (schoolDetailBackdrop) schoolDetailBackdrop.addEventListener('click', () => closeModal(schoolModalDetail));

    schoolWriteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('school-title').value.trim();
      const dept = document.getElementById('school-dept').value;
      const author = document.getElementById('school-author').value.trim();
      const content = document.getElementById('school-content').value.trim();
      const attachedFile = schoolUploader.getAttachedFile();

      if (editingSchoolId !== null) {
        const index = schoolData.findIndex(post => String(post.id) === String(editingSchoolId));
        if (index !== -1) {
          schoolData[index] = {
            ...schoolData[index], title, dept, author, content, file: attachedFile
          };
        }
      } else {
        const nextId = schoolData.length > 0 ? Math.max(...schoolData.map(p => p.id)) + 1 : 1;
        schoolData.push({
          id: nextId, title, dept, author,
          date: new Date().toISOString().substring(0, 10), content, file: attachedFile
        });
      }

      await saveBoardData('school_posts', schoolData);
      editingSchoolId = null;
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

    // 페이지를 열 때 저장된 게시글을 즉시 목록에 표시한다.
    renderSchool();

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
