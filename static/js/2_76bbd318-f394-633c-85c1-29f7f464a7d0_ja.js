document.addEventListener('DOMContentLoaded', async () => {
    const chatBoard = document.getElementById('chatBoard');
    const postForm = document.getElementById('postForm');
    const contentInput = document.getElementById('content');
    const imageUpload = document.getElementById('imageUpload');
    const pageInfoElement = document.getElementById('page-count');
    const prevButton = document.getElementById('btn_paging_prev');
    const nextButton = document.getElementById('btn_paging_next');
    const scrollUp = document.getElementById('scrollUp');
    const scrollDown = document.getElementById('scrollDown');
    const goLatest = document.getElementById('go-latest');
    const goFirst = document.getElementById('go-first');
    const scrollToBottom = document.getElementById('scroll-to-bottom');
    const searchForm = document.getElementById('searchForm');
    const popup = document.getElementById('popup');
    const closePopup = document.getElementById('closePopup');
    const useIdCheckbox = document.getElementById("use_id");
    let currentPage = 1;
    const postsPerPage = 60;
    let csrfToken = "";

    const BASE_API_URL = "https://api.9u9.jp";

    const fetchData = async (url) => {
        try {
            const apiUrl = `${BASE_API_URL}${url}`;
            const response = await fetch(apiUrl, {
                headers: {
                    "Content-Type": "application/json", 
                },
            });
    
            if (!response.ok) {
                throw new Error(`HTTPエラー: ${response.status} (${response.statusText})`);
            }
    
            const data = await response.json();
    
            if (data.result === "success") {
                return data;
            } else {
                console.error("APIエラー:", data.message || "詳細なエラー情報なし");
                return null;
            }
        } catch (error) {
            console.error("ネットワークエラーが発生しました:", error);
            return null;
        }
    };
    
    const renderMessages = (messages, keyword = null) => {
        chatBoard.innerHTML = ''; 
        messages.forEach((msg, index) => {

            const timestamp = new Date(msg.timestamp);
            const options = { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
            const formattedTimestamp = new Intl.DateTimeFormat('ja-JP', options).format(timestamp);
    
            let contentWithLinks = msg.content.replace(/&gt;&gt;(\d+)/g, (match, postId) => {
                const cleanPostId = postId.replace(/<\/?hit>/g, '');
                return `<span class="post-number-rep" onclick="window.showPopup('${cleanPostId}', event)"> >>${cleanPostId} </span>`;
            });
    
            if (keyword) {
                const regex = new RegExp(`(${keyword})`, 'gi');
                contentWithLinks = contentWithLinks.replace(regex, (match) => {
                    if (!match.includes('<hit>')) {
                        return `<hit>${match}</hit>`;
                    }
                    return match;
                });
            }
    
            const postElement = document.createElement('div');
            postElement.className = 'post';
    
            const imageHTML = msg.image_url
                ? `<img src="${msg.image_url}" alt="投稿画像" class="post-image" />`
                : '';
    
            postElement.innerHTML = `
                <a class="post-number" onclick="quotePost(${msg.post_id})">${msg.post_id}:</a>
                <span class="post-timestamp">${formattedTimestamp}</span>
                ${msg.user_id ? `<span class="post-user-id" style="color: green;">ID: ${msg.user_id}</span>` : ""}
                <div class="post-content">${contentWithLinks}</div>
                ${imageHTML}
            `;
    
            chatBoard.appendChild(postElement);
    
            if (index < messages.length - 1) {
                const hr = document.createElement('hr');
                chatBoard.appendChild(hr);
            }
        });
    };

    const csrfEndpoint = "/realfightchangairukarakosobokuhatsukematsugewokaerunokamoshirenai/e0jwpe3rh9eehr30wp"; 
    const fetchCsrfToken = async () => {
        try {
            const response = await axios.get(csrfEndpoint);
            csrfToken = response.data.naniittendaomaeha_orehananiitterukawakaranaidegowasu;
        } catch (error) {
            console.error('CSRFトークンの取得に失敗しました:', error);
        }
    };
    
    const escapeContent = (content) => {
        return content.replace(/>>(\d+)/g, (match, postId) => {
            return `&gt;&gt;${postId}`;
        });
    };
    
    const loadPage = async (page, isFirst = false) => {
        if (isFirst) {
            const initialData = await fetchData(`/r/posts/timeline?page=${page}&limit=1`);
            if (initialData) {
                page = initialData.pagination.total_pages;
            } else {
                return;
            }
        }
        const data = await fetchData(`/r/posts/timeline?page=${page}&limit=${postsPerPage}`);
        if (data) {
            const { current_page, total_pages, total_messages } = data.pagination;
            updatePagination(current_page, total_pages, total_messages);
            renderMessages(data.posts);
        }
    };
    
    const fetchSearchResults = async (keyword, page = 1) => {
        const url = `/r/posts/timeline/search?keyword=${encodeURIComponent(keyword)}&page=${page}&limit=${postsPerPage}`;
        const data = await fetchData(url);
        if (data) {
            const { posts, search_info } = data;
            updatePagination(page, Math.ceil(search_info.total_hits / postsPerPage), search_info.total_hits, true, search_info.keyword);
            renderMessages(posts, keyword);
        }
    };
    
    const postMessage = async () => {
        let content = contentInput.value.trim();
        const imageFile = imageUpload.files[0];
        const useId = useIdCheckbox.checked;
    
        if (!content && !imageFile) {
            alert('メッセージまたは画像を入力してください');
            return;
        }
    
        content = escapeContent(content);
    
        const formData = new FormData();
        formData.append("content", content);
        formData.append("use_id", useId);
        if (imageFile) {
            formData.append("image", imageFile);
        }
    
        try {
            const response = await axios.post('https://api.9u9.jp/r/posts/new', formData, {
                headers: {
                    "X-CSRF-Token": csrfToken
                }
            });
            if (response.data.result === "success") {
                contentInput.value = "";
                imageUpload.value = "";
                loadPage(currentPage);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('投稿に失敗しました:', error);
        }
    };
    
    const showPopup = (postId, event) => {
        const cleanPostId = typeof postId === 'string' ? postId.replace(/<\/?hit>/g, '') : postId;
        axios.get(`/r/posts/${cleanPostId}`)
            .then((response) => {
                const post = response.data.post;
                if (post) {
                    const contentWithLinks = post.content.replace(/&gt;&gt;(\d+)/g, (match, postId) => {
                        const cleanLinkPostId = postId.replace(/<\/?hit>/g, ''); 
                        return `<span class="post-number-rep" onclick="window.showPopup(${cleanLinkPostId}, event)"> ${cleanLinkPostId} </span>`;
                    });
    
                    const timestamp = new Date(post.timestamp);
                    const options = {
                        timeZone: 'Asia/Tokyo',
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                    };
                    const formattedTimestamp = new Intl.DateTimeFormat('ja-JP', options).format(timestamp);
    
                    const popup = document.createElement('div');
                    popup.classList.add('popup');
                    popup.innerHTML = `
                        <div class="popup-content">
                            <button class="popup-close">✖</button>
                            <a class="post-number" onclick="quotePost(${post.id})">${post.id}:</a>
                            <span class="post-timestamp">${formattedTimestamp}</span>
                            <p>${contentWithLinks}</p>
                        </div>
                    `;
                    const rect = event.target.getBoundingClientRect();
                    const x = rect.left + window.pageXOffset;
                    const y = rect.bottom + window.pageYOffset;
    
                    popup.style.left = `${x}px`;
                    popup.style.top = `${y}px`;
    
                    popup.querySelector('.popup-close').addEventListener('click', () => popup.remove());
    
                    document.body.appendChild(popup);
                    requestAnimationFrame(() => popup.classList.add('show'));
                } else {
                    alert('この番号で投稿してる人なんていないヨ❗');
                }
            })
            .catch((error) => {
                console.error('Failed to load message:', error);
            });
    };
    
    const quotePost = (postId) => {
        const quoteText = `>>${postId}`;
        if (!contentInput.value.includes(quoteText)) {
            contentInput.value = `${quoteText}\n` + contentInput.value;
        }
    };

    const hidePopup = () => {
        popup.classList.remove('show');
        popup.addEventListener('transitionend', () => {
            popup.style.display = 'none';
        }, { once: true });
    };

    closePopup.addEventListener('click', hidePopup);

    window.quotePost = quotePost;
    window.showPopup = showPopup;
    
    const updatePagination = (current_page, total_pages, total_hits = 0, isSearch = false, keyword = '') => {
        currentPage = current_page;
        if (isSearch) {
            pageInfoElement.textContent = `${total_hits}件ヒット! 「${keyword}」`;
        } else {
            pageInfoElement.textContent = `${current_page}/${total_pages}頁`;
        }
        prevButton.disabled = current_page <= 1;
        nextButton.disabled = current_page >= total_pages;
    };
    
    const handleScrollButtons = () => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const bodyHeight = document.body.scrollHeight;
        scrollUp.style.display = scrollPosition < 100 ? 'none' : 'block';
        scrollDown.style.display = scrollPosition + windowHeight >= bodyHeight - 100 ? 'none' : 'block';
    };

    prevButton.addEventListener('click', () => currentPage > 1 && loadPage(currentPage - 1));
    nextButton.addEventListener('click', () => loadPage(currentPage + 1));
    goLatest.addEventListener('click', () => loadPage(currentPage, true));
    goFirst.addEventListener('click', () => loadPage(1));
    scrollToBottom.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
    scrollUp.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollBy({ top: -window.innerHeight * 0.8, behavior: 'smooth' });
    });
    scrollDown.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
    });
    window.addEventListener('scroll', handleScrollButtons);

    postForm.addEventListener('submit', (e) => {
        e.preventDefault();
        postMessage();
    });

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const keyword = new FormData(searchForm).get('query').trim();
        if (keyword) {
            fetchSearchResults(keyword);
        }
    });
    await fetchCsrfToken();
    loadPage(currentPage, true);
});
    