/* =====================================================
   RENS ATTORNEY — main.js
   External JavaScript file
   Link: <script src="main.js"></script>
   ===================================================== */


/* ── 1. NAVBAR: turns solid when user scrolls down ── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
});


/* ── 2. MOBILE MENU toggle ── */
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}


/* ── 3. SCROLL REVEAL ANIMATIONS ──
   Elements with class "reveal" fade up into view
   as the user scrolls down the page.              */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => revealObserver.observe(el));


/* ── 4. QUOTES CAROUSEL ──
   Rotates through 12 famous lawyer quotes.
   Changes automatically every 4 minutes (240,000 ms).
   User can also click the dots to jump to any quote. */

const quotes = [
    {
        text: "The good lawyer is not the man who qualifies all his qualifications, but who throws himself on your part so heartily that he can get you out of a scrape.",
        author: "Ralph Waldo Emerson"
    },
    {
        text: "It is better that ten guilty persons escape than that one innocent suffer.",
        author: "Sir William Blackstone"
    },
    {
        text: "The law is reason, free from passion.",
        author: "Aristotle"
    },
    {
        text: "Justice is the constant and perpetual will to allot to every man his due.",
        author: "Emperor Justinian I"
    },
    {
        text: "The safety of the people shall be the highest law.",
        author: "Marcus Tullius Cicero"
    },
    {
        text: "Injustice anywhere is a threat to justice everywhere.",
        author: "Martin Luther King Jr."
    },
    {
        text: "Wherever law ends, tyranny begins.",
        author: "John Locke"
    },
    {
        text: "In law, nothing is certain but the expense.",
        author: "Samuel Butler"
    },
    {
        text: "An unjust law is no law at all.",
        author: "Saint Augustine of Hippo"
    },
    {
        text: "The first duty of society is justice.",
        author: "Alexander Hamilton"
    },
    {
        text: "Lawyers are the only persons in whom ignorance of the law is not punished.",
        author: "Jeremy Bentham"
    },
    {
        text: "The law must be stable, but it must not stand still.",
        author: "Roscoe Pound"
    },
];

let currentQ    = 0;
const qText     = document.getElementById('quoteText');
const qAuthor   = document.getElementById('quoteAuthor');
const qDots     = document.getElementById('quoteDots');
const qProgress = document.getElementById('quoteProgress');

/* Build the clickable dot indicators */
quotes.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'q-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Quote ' + (i + 1));
    dot.addEventListener('click', () => goToQuote(i));
    qDots.appendChild(dot);
});

/* Switch to a specific quote with fade animation */
function goToQuote(idx) {
    /* Fade out current quote */
    qText.classList.add('fading');
    qAuthor.classList.add('fading');

    /* Reset the progress bar animation */
    qProgress.classList.remove('running');
    void qProgress.offsetWidth; /* force reflow to restart animation */

    setTimeout(() => {
        /* Swap the text */
        currentQ            = idx;
        qText.textContent   = '\u201C' + quotes[idx].text + '\u201D';
        qAuthor.textContent = '\u2014 ' + quotes[idx].author;

        /* Fade back in */
        qText.classList.remove('fading');
        qAuthor.classList.remove('fading');

        /* Update which dot is active */
        document.querySelectorAll('.q-dot').forEach((d, i) => {
            d.classList.toggle('active', i === idx);
        });

        /* Restart the progress bar */
        qProgress.classList.add('running');

    }, 800); /* wait for fade-out to finish before swapping */
}

/* Start the progress bar on page load */
qProgress.classList.add('running');

/* Auto-rotate every 4 minutes = 240,000 milliseconds */
setInterval(() => {
    goToQuote((currentQ + 1) % quotes.length);
}, 240000);


/* ── 5. FILE UPLOAD ──
   Shows the attached file names inside the upload box.
   Also handles drag-and-drop onto the upload zone.   */

function onFileChange(input) {
    const fileList = document.getElementById('fileList');

    if (!input.files || input.files.length === 0) {
        fileList.textContent = '';
        return;
    }

    const names = Array.from(input.files)
        .map(f => '- ' + f.name)
        .join('\n');

    fileList.textContent = input.files.length + ' file(s) attached:\n' + names;
}

/* Drag-and-drop support for the upload zone */
const dropZone = document.getElementById('fileDropZone');

['dragenter', 'dragover'].forEach(evt => {
    dropZone.addEventListener(evt, (e) => {
        e.preventDefault();
        dropZone.classList.add('dragging');
    });
});

['dragleave', 'drop'].forEach(evt => {
    dropZone.addEventListener(evt, () => {
        dropZone.classList.remove('dragging');
    });
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    const fileInput   = document.getElementById('fileInput');
    fileInput.files   = e.dataTransfer.files;
    onFileChange(fileInput);
});


/* ── 6. FORM SUBMISSION ──
   Validates all required fields.
   If valid → shows the 24hr confirmation alert and resets the form.
   If invalid → highlights the empty fields in red.              */

function handleSubmit() {
    const fields = [
        document.getElementById('firstName'),
        document.getElementById('lastName'),
        document.getElementById('email'),
        document.getElementById('phone'),
        document.getElementById('state'),
        document.getElementById('area'),
        document.getElementById('consultType'),
        document.getElementById('details'),
        document.getElementById('consent'),
    ];

    let allValid = true;

    fields.forEach(field => {
        const isEmpty = field.type === 'checkbox'
            ? !field.checked
            : !field.value.trim();

        if (isEmpty) {
            field.classList.add('error');
            allValid = false;
        } else {
            field.classList.remove('error');
        }
    });

    /* Stop here if anything is missing */
    if (!allValid) {
        alert('Please complete all required fields before submitting.');
        return;
    }

    /* SUCCESS — show the 24hr confirmation alert */
    alert(
        'Your case has been submitted successfully!\n\n' +
        'We will get back to you in 24hrs...\n\n' +
        'Thank you for trusting Rens Attorney with your legal matter.\n' +
        'A confirmation will be sent to your email address shortly.\n\n' +
        '— The Rens Attorney Team\n' +
        '10 Optimum Hotel, Area 1, Garki, Abuja, FCT'
    );

    /* Clear the form after successful submission */
    document.getElementById('caseForm').reset();
    document.getElementById('fileList').textContent = '';
    fields.forEach(f => f.classList.remove('error'));
}