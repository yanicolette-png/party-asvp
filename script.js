document.addEventListener("DOMContentLoaded", () => {
  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwEmann0ogv1VKB1DzxMH69BU8Gah_lsruUOUN-qhUjr9Y-xwga-UZG3yenazLpHzw8/exec";

  const form = document.getElementById("rsvpForm");
  const submitBtn = form?.querySelector(".submit-btn");

  const lunchAttend = document.getElementById("lunchAttend");
  const lunchAbsent = document.getElementById("lunchAbsent");

  const parkingSection = document.getElementById("parkingSection");
  const dietarySection = document.getElementById("dietarySection");

  if (
    !form ||
    !submitBtn ||
    !lunchAttend ||
    !lunchAbsent ||
    !parkingSection ||
    !dietarySection
  ) {
    console.error(
      "RSVP form elements are missing. Check the element IDs in index.html."
    );
    return;
  }

  const parkingInputs = parkingSection.querySelectorAll(
    'input[name="Parking"]'
  );

  const dietaryInput = dietarySection.querySelector(
    'textarea[name="Dietary"]'
  );

  function setSectionVisible(section, visible) {
    section.classList.toggle("hidden-section", !visible);
    section.setAttribute("aria-hidden", String(!visible));
  }

  function updateConditionalSections() {
    const isAttending = lunchAttend.checked;

    setSectionVisible(parkingSection, isAttending);
    setSectionVisible(dietarySection, isAttending);

    parkingInputs.forEach((input) => {
      input.disabled = !isAttending;

      if (!isAttending) {
        input.checked = false;
      }
    });

    if (dietaryInput) {
      dietaryInput.disabled = !isAttending;

      if (!isAttending) {
        dietaryInput.value = "";
      }
    }
  }

  lunchAttend.addEventListener("change", updateConditionalSections);
  lunchAbsent.addEventListener("change", updateConditionalSections);

  // Hide Parking and Dietary when the page first loads.
  updateConditionalSections();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);

    // These five names must match the Google Sheet headers.
    const data = {
      Name: String(formData.get("Name") || "").trim(),
      Lunch: String(formData.get("Lunch") || "").trim(),
      Parking: String(formData.get("Parking") || "").trim(),
      Dietary: String(formData.get("Dietary") || "").trim(),
      MSG: String(formData.get("MSG") || "").trim()
    };

    console.log("Submitting RSVP:", data);

    submitBtn.disabled = true;
    submitBtn.innerHTML = "送信中...<span>Sending...</span>";

    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(data)
      });

      form.innerHTML = `
        <section class="text-section">
          <h2>ありがとうございます</h2>
          <span>Thank you for your RSVP</span>

          <p>
            ご回答を受け付けました。<br><br>
            Your response has been received.<br><br>
            Takatora & Nicolette
          </p>
        </section>
      `;

      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
      });
    } catch (error) {
      console.error("RSVP submission error:", error);

      alert("送信できませんでした。もう一度お試しください。");

      submitBtn.disabled = false;
      submitBtn.innerHTML =
        "ご回答を送信<span>Submit RSVP</span>";
    }
  });
});

/* ===========================
   Scroll Animations
=========================== */

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.18
  }
);

document
  .querySelectorAll(
    ".text-section, .photo, .gallery-three, .timeline-item, .form-block"
  )
  .forEach((element) => {
    element.classList.add("fade-section");
    observer.observe(element);
  });

document.querySelectorAll(".timeline-item").forEach((item, index) => {
  item.style.transitionDelay = `${index * 0.12}s`;
}); 