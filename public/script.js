let currentStep = 0;

const steps = document.querySelectorAll(".step");
const contents = document.querySelectorAll(".step-content");
const btnBack = document.getElementById("btnBack");
const btnNext = document.getElementById("btnNext");

/* Hiển thị step */
function showStep(i) {
    contents.forEach(c => c.classList.remove("active"));
    steps.forEach(s => s.classList.remove("active"));

    contents[i].classList.add("active");
    steps[i].classList.add("active");

    btnBack.style.display = i === 0 ? "none" : "inline-block";
    btnNext.innerText = i === contents.length - 1 ? "Xác nhận" : "Tiếp theo";

    if (i === 2) resizeCanvas(); // Step 3: canvas
}

/* Next / Back */
btnNext.onclick = () => {
    // if (!validateStep(currentStep)) return;

    // Nếu Step 3 → Step 4, fill dữ liệu
    if (currentStep === 2) {
        fillReviewData();
    }

    if (currentStep === contents.length - 1) {
        submitForm();
    } else {
        currentStep++;
        showStep(currentStep);
    }
};

btnBack.onclick = () => {
    if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
    }
};

/* Preview image */
function previewImage(input, id) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
        const img = document.getElementById(id);
        img.src = e.target.result;
        img.style.display = "block";
    };
    reader.readAsDataURL(file);
}

/* Canvas chữ ký */
const canvas = document.getElementById("signaturePad");
const ctx = canvas.getContext("2d");
let drawing = false;

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

canvas.addEventListener("mousedown", e => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener("mousemove", e => {
    if (!drawing) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
});

canvas.addEventListener("mouseup", () => drawing = false);

function clearSignature() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/* Fill dữ liệu vào Step 4 */
function fillReviewData() {
    // Step 2
    const name = document.getElementById("cccdName").value;
    const cccd = document.getElementById("cccdNumber").value;
    const address = document.getElementById("cccdAddress").value;

    document.getElementById("reviewName").value = name;
    document.getElementById("reviewCccd").value = cccd;
    document.getElementById("reviewAddress").value = address;

    // Step 3: chữ ký
    const signImg = document.getElementById("imgSign");
    const reviewSign = document.getElementById("reviewSign");

    if (signImg && signImg.src && signImg.src !== "") {
        reviewSign.src = signImg.src;
        reviewSign.style.display = "block";
    } else if (canvas && canvas.width > 0 && canvas.height > 0) {
        reviewSign.src = canvas.toDataURL();
        reviewSign.style.display = "block";
    } else {
        reviewSign.style.display = "none";
    }
}

/* Submit form */
function submitForm() {
    const form = document.getElementById("multiForm");
    const data = new FormData(form);
    console.log("Dữ liệu gửi:", Object.fromEntries(data.entries()));
    alert("Gửi thành công!");
}

showStep(0);
