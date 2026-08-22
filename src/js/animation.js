//jshint esversion:6

const button = document.querySelector(".btn"),
  darkroom = document.querySelector(".darkroom"),
  giftroom = document.querySelector(".giftroom"),
  hallway = document.querySelector(".hallway"),
  room = document.querySelector(".empty-room"),
  flash = document.querySelector(".flash");

// These are the text elements that hold messages to be displayed in the respective screes

const blackText = document.querySelectorAll(".bb-text"), // msgs in the dark room scene
  giftText = document.querySelectorAll(".gift-text"), // msgs in the gift scene
  hallText = document.querySelectorAll(".hall-text"), // msgs in the hallway scene
  roomText = document.querySelectorAll(".room-text"), // msgs in empty room scene
  CTAtext = document.querySelector(".btn-ref");

//Elements in the card page

const frames = document.querySelectorAll(".frame"),
  msgWindow = document.querySelector(".scroll"), // this one has the message frame in [0] and card fram in [1]
  msg = document.querySelector(".text"); // the Message para

//Sfx files

const light = document.querySelector(".switch-aud"),
  blast = document.querySelector(".blast-aud"),
  door = document.querySelector(".door-aud"),
  haunt = document.querySelector(".haunt-aud"),
  music = document.querySelector(".hbd-aud");

//  readMsg() displays the paras in each scene successively. It takes an array of the para elements as input.

const readMsg = (text) => {
  for (let i = 0; i < text.length; i++) {
    // this loop goes through all the text msg paras
    setTimeout(() => {
      // A timeout of 5s ia applied to all text elements so that appear successively one after the other
      text[i].classList.add("read"); // this adds a fadeIn-fadeOut animation to elements
      if (i === text.length - 1) {
        // this ensures that the button appears only after the last text is displayed.
        button.style.display = "inline-block";
        CTAtext.style.display = "block";
      }
    }, 5000 * i);
  }
};

// transition() is animation for change from one scene to another. It takes the current scene div element as input.

const transition = (currentScene) => {
  currentScene.classList.add("fade-in");
  currentScene.style.opacity = "0";
  button.style.display = "none";
  CTAtext.style.display = "none";
};

// Mobile Audio Autoplay Policy Helper
const unlockAudio = () => {
  const audios = [light, blast, door, haunt, music];
  audios.forEach((aud) => {
    if (aud) {
      aud.play().then(() => {
        aud.pause();
        aud.currentTime = 0;
      }).catch(() => {});
    }
  });
};

export const animate = function () {
  document.addEventListener("touchstart", unlockAudio, { once: true });
  document.addEventListener("click", unlockAudio, { once: true });

  CTAtext.innerHTML = "Click the Light Bulb.";

  readMsg(blackText);

  button.addEventListener("click", function () {
    if (button.classList.contains("switch")) {
      /* 
              When the switch is pressed, the black div will wipe out and the backgroung scene with no 
              elements will appear, signifying that the lights are turned on and the room is empty. Then 
              the msg will be displayed after which, the user will be asked to move out and the button with
              door icon will appear. 
          */

      light.play();
      transition(darkroom);
      CTAtext.innerHTML = "Click the Door";
      setTimeout(function () {
        button.classList.add("door-out");
        button.classList.remove("switch");
        darkroom.style.display = "none";
        readMsg(roomText);
      }, 4000);
    } else if (button.classList.contains("door-out")) {
      /* 
              when the door is pressed, scene changes to cemetry. Again, the msg will be displayed, after 
              which, the user will be asked to come inside and the button with door will appear again.
          */

      door.play();
      transition(room);
      setTimeout(function () {
        haunt.play();
        haunt.loop = true;
        button.classList.add("door-in");
        button.classList.remove("door-out");
        room.style.display = "none";
        readMsg(hallText);
      }, 4000);
    } else if (button.classList.contains("door-in")) {
      /* 
              when the door is pressed, scene changes to the gift room. Again, the msg will be displayed, after 
              which, the user will be asked to open the gift and the button with gift will appear.
          */

      door.play();
      transition(hallway);
      CTAtext.innerHTML = "Click the Gift";
      setTimeout(function () {
        button.classList.add("gift");
        button.classList.remove("door-in");
        hallway.style.display = "none";
        readMsg(giftText);
      }, 4000);
    } else if (button.classList.contains("gift")) {
      /* 
          When the gift box is clicked:
          1. Pause haunted sound, play blast & Happy Birthday music.
          2. Hide giftroom, fade out flash.
          3. Display the Love Letter Modal (frames[1]) cleanly with active-frame class.
          4. When "See Our Memories 💖 →" is clicked, fade out letter and reveal 6-photo carousel (frames[0]).
      */

      haunt.pause();
      blast.play();
      giftroom.style.display = "none";
      transition(flash);

      music.loop = true;
      music.play();

      // Show Love Letter Frame (frames[1])
      frames[1].style.display = "flex";
      frames[1].classList.add("active-frame");

      setTimeout(() => {
        frames[1].style.opacity = "1";
        flash.style.display = "none";
      }, 500);

      // Handle "See Our Memories 💖 →" click
      const proceedToMemories = () => {
        if (frames[0].style.display === "flex") return;

        frames[1].style.opacity = "0";
        setTimeout(() => {
          frames[1].style.display = "none";
          frames[1].classList.remove("active-frame");

          // Reveal 6-Photo Carousel & Card (frames[0])
          frames[0].style.display = "flex";
          frames[0].classList.add("appear");
          frames[0].style.opacity = "1";
          initPolaroidGallery();
        }, 500);
      };

      const continueBtn = document.getElementById("continueToCardBtn");
      if (continueBtn) {
        continueBtn.addEventListener("click", proceedToMemories);
      }
    }
  });
};

const initPolaroidGallery = () => {
  const cards = document.querySelectorAll(".polaroid-card");
  const dots = document.querySelectorAll(".polaroid-dots .dot");
  const prevBtn = document.getElementById("prevMemory");
  const nextBtn = document.getElementById("nextMemory");
  const gallery = document.getElementById("polaroidGallery");

  if (!cards.length) return;

  let currentIndex = 0;

  const showCard = (index) => {
    cards.forEach((card, i) => {
      card.classList.toggle("active", i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
    currentIndex = index;
  };

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      let prevIndex = (currentIndex - 1 + cards.length) % cards.length;
      showCard(prevIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      let nextIndex = (currentIndex + 1) % cards.length;
      showCard(nextIndex);
    });
  }

  // Touch Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  if (gallery) {
    gallery.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    gallery.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 40) {
        // Swipe left -> Next
        let nextIndex = (currentIndex + 1) % cards.length;
        showCard(nextIndex);
      } else if (touchEndX - touchStartX > 40) {
        // Swipe right -> Prev
        let prevIndex = (currentIndex - 1 + cards.length) % cards.length;
        showCard(prevIndex);
      }
    });
  }
};

