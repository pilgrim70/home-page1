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

    return {
      getAttachedFile: () => attachedFile,
      resetAttachedFile: resetAttachedFile
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

    const newsUploader = setupFileUpload(
      'btn-browse-news-file',
      'news-file-input',
      'news-file-status',
      'news-file-preview-container',
      'news-title',
      'news-content'
    );

    let newsData = getBoardData('news_posts_v2', defaultNews);

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
      const cat = item.category || 'news';
      document.getElementById('news-detail-title').innerText = item.title;
      document.getElementById('news-detail-category').innerHTML = `<i class="la la-tag"></i> 구분: ${getCategoryKoName(cat)}`;
      document.getElementById('news-detail-author').innerHTML = `<i class="la la-user"></i> 작성자: ${item.author || '관리자'}`;
      document.getElementById('news-detail-date').innerHTML = `<i class="la la-calendar"></i> 작성일자: ${item.date}`;
      document.getElementById('news-detail-body').innerText = item.content || (item.file ? '' : '상세 내용이 없습니다.');
      renderDetailAttachment(document.getElementById('news-detail-attachment'), item.file);
      openModal(newsModalDetail);
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

          tr.querySelector('.btn-delete').addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('이 글을 삭제하시겠습니까?')) {
              newsData = newsData.filter(p => p.id !== item.id);
              saveBoardData('news_posts_v2', newsData);
              renderNews();
            }
          });

          juboListBody.appendChild(tr);
        });
      }
    }

    if (btnOpenNewsWrite) {
      btnOpenNewsWrite.addEventListener('click', () => {
        newsWriteForm.reset();
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
      saveBoardData('news_posts_v2', newsData);
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
