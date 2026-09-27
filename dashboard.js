document.addEventListener("DOMContentLoaded", function () {

const loginScreen = document.getElementById("loginScreen");
const dashboard = document.getElementById("dashboard");

const loginForm = document.getElementById("loginForm");
const logoutButton = document.getElementById("logoutButton");

const navItems = document.querySelectorAll(".nav-item");

const sections = {
    overview: document.getElementById("overviewSection"),
    articles: document.getElementById("articlesSection"),
    newArticle: document.getElementById("newArticleSection"),
    subscribers: document.getElementById("subscribersSection")
};

const pageTitle = document.getElementById("pageTitle");

const articleForm = document.getElementById("articleForm");
const articleImage = document.getElementById("articleImage");
const imagePreview = document.getElementById("imagePreview");
const uploadContent = document.getElementById("uploadContent");

const articlesList = document.getElementById("articlesList");

const articleCount = document.getElementById("articleCount");
const draftCount = document.getElementById("draftCount");
const subscriberCount = document.getElementById("subscriberCount");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");


/* =========================
   LOGIN
========================= */

function showDashboard() {
    loginScreen.style.display = "none";
    dashboard.classList.add("logged-in");
}


function showLogin() {
    loginScreen.style.display = "flex";
    dashboard.classList.remove("logged-in");
}


loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    /*
     * DASHBOARD V1 LOGIN
     *
     * This is only a temporary local login.
     * We will replace this with secure Supabase authentication later.
     */

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        showToast("Please enter your email and password.");
        return;
    }

    localStorage.setItem("celebStyleLoggedIn", "true");

    showDashboard();

});


logoutButton.addEventListener("click", function () {

    localStorage.removeItem("celebStyleLoggedIn");

    showLogin();

});


/* =========================
   CHECK LOGIN
========================= */

if (localStorage.getItem("celebStyleLoggedIn") === "true") {
    showDashboard();
} else {
    showLogin();
}


/* =========================
   NAVIGATION
========================= */

function openSection(sectionName) {

    Object.keys(sections).forEach(function (key) {

        sections[key].classList.remove("active-section");

    });

    if (sections[sectionName]) {
        sections[sectionName].classList.add("active-section");
    }


    navItems.forEach(function (item) {

        item.classList.remove("active");

        if (item.dataset.section === sectionName) {
            item.classList.add("active");
        }

    });


    const titles = {
        overview: "Dashboard",
        articles: "Published Articles",
        newArticle: "Create New Article",
        subscribers: "Subscribers"
    };

    pageTitle.textContent = titles[sectionName] || "Dashboard";


    document.querySelector(".sidebar").classList.remove("mobile-open");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


navItems.forEach(function (item) {

    item.addEventListener("click", function () {

        openSection(item.dataset.section);

    });

});


document.getElementById("startArticleButton").addEventListener(
    "click",
    function () {
        openSection("newArticle");
    }
);


document.getElementById("quickNewArticle").addEventListener(
    "click",
    function () {
        openSection("newArticle");
    }
);


document.getElementById("articlesNewButton").addEventListener(
    "click",
    function () {
        openSection("newArticle");
    }
);


document.getElementById("cancelArticleButton").addEventListener(
    "click",
    function () {
        openSection("articles");
    }
);


/* =========================
   MOBILE MENU
========================= */

const mobileMenuButton =
    document.getElementById("mobileMenuButton");

mobileMenuButton.addEventListener("click", function () {

    document
        .querySelector(".sidebar")
        .classList.toggle("mobile-open");

});


/* =========================
   IMAGE PREVIEW
========================= */

articleImage.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) {
        return;
    }

    if (!file.type.startsWith("image/")) {

        showToast("Please select an image file.");

        this.value = "";

        return;
    }


    const reader = new FileReader();

    reader.onload = function (event) {

        imagePreview.src = event.target.result;

        imagePreview.style.display = "block";

        uploadContent.style.display = "none";

    };

    reader.readAsDataURL(file);

});


/* =========================
   DATE
========================= */

const articleDate = document.getElementById("articleDate");

const today = new Date();

const year = today.getFullYear();

const month = String(today.getMonth() + 1).padStart(2, "0");

const day = String(today.getDate()).padStart(2, "0");

articleDate.value = `${year}-${month}-${day}`;


/* =========================
   ARTICLES
========================= */

function getArticles() {

    return JSON.parse(
        localStorage.getItem("celebStyleArticles") || "[]"
    );

}


function saveArticles(articles) {

    localStorage.setItem(
        "celebStyleArticles",
        JSON.stringify(articles)
    );

}


function updateStats() {

    const articles = getArticles();

    articleCount.textContent = articles.length;

    draftCount.textContent = "0";

    subscriberCount.textContent = "0";

}


function displayArticles() {

    const articles = getArticles();

    articlesList.innerHTML = "";


    if (articles.length === 0) {

        articlesList.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">📰</div>

                <h3>No articles yet</h3>

                <p>
                    Your published stories will appear here.
                </p>

            </div>
        `;

        updateStats();

        return;
    }


    articles.forEach(function (article) {

        const item = document.createElement("div");

        item.className = "article-item";

        item.innerHTML = `

            <img
                src="${article.image}"
                class="article-item-image"
                alt="${escapeHTML(article.title)}"
            >

            <div class="article-item-info">

                <span class="article-category">
                    ${escapeHTML(article.category)}
                </span>

                <h3>
                    ${escapeHTML(article.title)}
                </h3>

                <p>
                    ${escapeHTML(article.date)}
                    •
                    ${escapeHTML(article.author)}
                </p>

            </div>
        `;

        articlesList.appendChild(item);

    });


    updateStats();

}


/* =========================
   PUBLISH ARTICLE
========================= */

articleForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const title =
        document.getElementById("articleTitle").value.trim();

    const description =
        document.getElementById("articleDescription").value.trim();

    const category =
        document.getElementById("articleCategory").value;

    const author =
        document.getElementById("articleAuthor").value.trim();

    const date =
        document.getElementById("articleDate").value;

    const content =
        document.getElementById("articleContent").value.trim();


    if (!articleImage.files[0]) {

        showToast("Please choose an article picture.");

        return;

    }


    const image =
        imagePreview.src;


    const newArticle = {

        id: Date.now(),

        title: title,

        description: description,

        category: category,

        author: author,

        date: date,

        content: content,

        image: image

    };


    const articles = getArticles();

    articles.unshift(newArticle);

    saveArticles(articles);


    articleForm.reset();

    imagePreview.src = "";

    imagePreview.style.display = "none";

    uploadContent.style.display = "flex";

    articleDate.value =
        `${year}-${month}-${day}`;


    displayArticles();

    openSection("articles");

    showToast("Article published successfully.");

});


/* =========================
   SAVE DRAFT
========================= */

document.getElementById("saveDraftButton")
    .addEventListener("click", function () {

        showToast(
            "Draft system will be connected in the next stage."
        );

    });


/* =========================
   TOAST
========================= */

function showToast(message) {

    toastMessage.textContent = message;

    toast.classList.add("show");


    setTimeout(function () {

        toast.classList.remove("show");

    }, 3000);

}


/* =========================
   HTML SAFETY
========================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================
   INITIAL LOAD
========================= */

displayArticles();

});
