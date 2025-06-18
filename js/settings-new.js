import { languages, updateLanguage, getElementLanguageData, unsafeGetElementLanguageData, currentLanguage, currentLanguageData } from "./locales-old.js";
let _currentLanguage = currentLanguage;

// Settings Handler
const settingsFrame = document.getElementById("settingsFrame");
const settingsList = document.getElementById("settingsList");
const settingsExtra = document.getElementById("settingsExtra");
let settingsOpen = false;

const settingsHeaderLangPrefix = "settingsCategory";
const settingsItemLangPrefix = "settingsItem";
const settingsSocialLangPrefix = "settingsSocial";

async function getSettingDisplayName(name) {
  return await getElementLanguageData(settingsItemLangPrefix + name);
}

async function getSettingHeaderText(name) {
  return await getElementLanguageData(settingsHeaderLangPrefix + name);
}

async function getSocialLinkText(name) {
  return await getElementLanguageData(settingsSocialLangPrefix + name);
}

async function initSettings() {
  const categoryNames = {
    Visual: await getElementLanguageData("settingsCategoryVisual"),
    Features: await getElementLanguageData("settingsCategoryFeatures"),
    Performance: await getElementLanguageData("settingsCategoryPerformance"),
    Advanced: await getElementLanguageData("settingsCategoryAdvanced"),
  };

  const socialLinks = [
    {name: "Discord", url: "https://discord.gg/KZzVM4rfg6", icon: "img/discord.jpg"},
    {name: "AlternateSiteHub", url: "https://butterdogceo.github.io/"},
    {name: "ButterDogCoSite", url: "https://butterdogceo.github.io/bdogco/", icon: "img/butterdogco.png"},
  ];

  let settings = {
    /*["Particles"]: {
      SetTo: "false",
      Options: ["true", "false"], // The default option is expected to be the first
      UpdateFunction: function(val) {
        particlesEnabled = val == "true" && true || false;
        if (particlesEnabled == true) {
          createParticles();
        }
      }
    },*/

    ["Language"]: {
      Category: "Visual",
      LanguageKey: "Language",
      SetTo: _currentLanguage || "English",
      Options: Object.keys(languages),
      UpdateFunction: (newLang) => {
        if (newLang != _currentLanguage) {
          _currentLanguage = newLang;
          updateLanguage(newLang);
        }
      },
    },

    ["Grid Mode"]: {
      Category: "Visual",
      LanguageKey: "AppGridMode",
      SetTo: "Default",
      Options: ["Default", "Square", "LargeTiles"],
      UpdateFunction: function (newSize) {
        appsDiv.classList.remove(currentAppSize);
        appsDiv.classList.add(newSize);
        currentAppSize = newSize;
      },
    },

    ["Weekly Recommendations"]: {
      Category: "Features",
      LanguageKey: "WeeklyRecommendations",
      SetTo: "true",
      Options: ["true", "false"],
      UpdateFunction: function (val) {
        const enabled = (val == "true" || val == true) && true || false;
        document.querySelectorAll(".weeklyRecommendations").forEach((element) => {
          if (enabled) {
            element.style = "";
          } else {
            element.style.display = "none";
          }
        });
      }
    },

    ["Settings In-Game"]: {
      Category: "Features",
      LanguageKey: "ShowSettingsInGame",
      SetTo: "true",
      Options: ["true", "false"],
      UpdateFunction: function (val) {
        const enabled = (val == "true" || val == true) && true || false;
        updateVisibilityOfSettingsButton(enabled);
        if (settingsOpen && !enabled && appOpen) {
          toggleSettings();
        }
      }
    },

    ["Speedrun Timer"]: {
      Category: "Features",
      LanguageKey: "SpeedrunTimer",
      SetTo: "false",
      Options: ["false", "true"],
      UpdateFunction: function (val) {
        const enabled = (val == "true" || val == true) && true || false;
        timerEnabled = enabled;
        if (!enabled) {
          closeSpeedrunTimer();
        }
        updateVisibilityOfToggleButton();
      }
    },

    ["MobileMode"]: {
      Category: "Features",
      LanguageKey: "HideNonMobileApps",
      SetTo: "false",
      Options: ["false", "true"],
      UpdateFunction: function (val) {
        const enabled = (val == "true" || val == true) && true || false;
        document.body.classList.toggle("mobileMode", enabled);
        document.querySelectorAll(".apps").forEach(div => {
          const placeholder = div.querySelector(".placeholder");
          const allHidden = [...div.querySelectorAll(".appsButton")].every((button) => button.classList.contains("mobileApp") == false);
          if (placeholder) {
            if (allHidden == false && enabled == true && div.childElementCount > 1) { // Force hide placeholder since CSS won't handle this due to the child count
              placeholder.style.display = "none";
            } else if (allHidden == true && enabled == true && div.childElementCount > 1) { // Force show placeholder since CSS won't handle this due to the child count
              placeholder.style.display = "block";
            } else { // Don't override (let CSS handle it)
              placeholder.style = "";
            }
          }
        });
      },
    },

    ["FlipInAppButtons"]: {
      Category: "Features",
      LanguageKey: "flipInAppButtons",
      SetTo: "false",
      Options: ["false", "true"],
      UpdateFunction: function (val) {
        const enabled = (val == "true" || val == true) && true || false;
        document.body.classList.toggle("flipInAppButtons", enabled);
      }
    },

    ["Transparent background blurring"]: {
      Category: "Performance",
      LanguageKey: "TransparentBackgroundBlurring",
      SetTo: "false",
      Options: ["false", "true"],
      UpdateFunction: function (val) {
        const enabled = (val == "true" || val == true) && true || false;
        document.body.classList.toggle("blurEnabled", enabled);
      }
    },

    ["Export Saved Data"]: {
      Category: "Advanced",
      LanguageKey: "ExportSavedData",
      Icon: "download.svg",
      RunFunction: exportData,
    },

    ["Import Saved Data"]: {
      Category: "Advanced",
      LanguageKey: "ImportSavedData",
      Icon: "upload.svg",
      RunFunction: loadData,
      FileInput: true,
    },
  }

  buildSettingsUI(settings, socialLinks, categoryNames);
}

async function buildSettingsUI(settings, socialLinks, categoryNames) {
  const categories = [];

  // Setup categories array
  for (let key in settings) {
    const saved = getSavedSetting(key, settings);
    if (saved) {
      updateSetting(key, saved, false, settings);
    }

    const category = settings[key]["Category"] || "General";
    if (!categories.some(cat => cat.name === category)) {
      categories.push({ name: category, options: [key] });
    } else {
      categories.find(cat => cat.name === category).options.push(key);
    }
  }

  // Create categories
  categories.forEach(async (category) => {
    const categoryElement = document.createElement("h3");
    categoryElement.setAttribute("data-lang", settingsHeaderLangPrefix + category.name);
    categoryElement.innerText = !currentLanguageData && await getSettingHeaderText(category.name) || unsafeGetElementLanguageData(settingsHeaderLangPrefix + category.name);
    settingsList.appendChild(categoryElement);
    category.options.forEach((option) => {
      createOptionButton(option, settings);
    });
  });

  // Create social link buttons
  const container = document.createElement("ul");
  container.id = "socialLinks";
  socialLinks.forEach(async (link) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.target = "_blank";
    a.href = link.url;
    a.title = link.url;
    li.appendChild(a);

    const img = document.createElement("img");
    img.src = link.icon || "img/butterdog.png";
    img.className = "socialIcon";
    a.appendChild(img);

    const text = document.createElement("p");
    text.setAttribute("data-lang", settingsSocialLangPrefix + link.name);
    text.innerText = !currentLanguageData && (await getSocialLinkText(link.name) || link.name) || (unsafeGetElementLanguageData(settingsSocialLangPrefix + link.name) || link.name);
    text.className = "socialText";
    a.appendChild(text);
    container.appendChild(li);
  });

  settingsExtra.appendChild(container);
}


export function toggleSettings() {
  settingsFrame.classList.toggle("open");
  settingsOpen = settingsFrame.classList.contains("open");
  document.body.classList.toggle("settingsOpen", settingsOpen);
}

function updateVisibilityOfSettingsButton(value) {
  const toggleButton = document.querySelector(".appSettingsButton");
  if (toggleButton) {
    toggleButton.style.display = value ? "block" : "none";
  }
}

function checkIfOptionIsValid(options, value) {
  return options.includes(`${value}`);
}

function updateSetting(name, newValue, save, settings) {
  const option = settings[name];
  if (option && checkIfOptionIsValid(option.Options, newValue)) {
    option["SetTo"] = newValue;
    if (save == true) {
      saveSetting(name, settings);
    }

    const func = settings[name]["UpdateFunction"];
    if (func) {
      func(option.SetTo);
    }
  }
}

function saveSetting(name, settings) {
  if (settings[name] != null) {
    localStorage.setItem(`settings-${name}`, settings[name]["SetTo"]);
  }
}

function getSavedSetting(name, settings) {
  if (settings[name] != null) {
    return localStorage.getItem(`settings-${name}`);
  }
}

async function createOptionButton(name, settings) {
  const option = settings[name];
  if (option != null) {
    // Check if the default value is a boolean
    const isABoolean = option.SetTo == "true" || option.SetTo == "false";
    const availableOptions = option.Options;

    const frame = document.createElement("li");
    frame.classList.add("option");
    const label = document.createElement("p");
    label.setAttribute("data-lang", settingsItemLangPrefix + option.LanguageKey);
    label.innerText = option.LanguageKey && (!currentLanguageData && await getSettingDisplayName(option.LanguageKey) || unsafeGetElementLanguageData(settingsItemLangPrefix + option.LanguageKey)) || name;
    label.classList.add("label");
    frame.appendChild(label);

    if (isABoolean == true) {
      const checkbox = document.createElement("input");
      checkbox.classList.add("checkbox");
      checkbox.type = "checkbox";
      checkbox.checked = option.SetTo == "true" && true || false;
      checkbox.onclick = () => {
        updateSetting(name, checkbox.checked, true, settings);
      }
      frame.appendChild(checkbox);
    } else if (availableOptions) {
      const dropdown = document.createElement("select");
      dropdown.classList.add("dropdown");
      dropdown.name = name;
      dropdown.onchange = (event) => {
        updateSetting(name, event.target.value, true, settings);
      }

      availableOptions.forEach(function (optionValue) {
        const optionElement = document.createElement("option");
        optionElement.value = optionValue;
        optionElement.innerText = optionValue;
        if (option.SetTo == optionValue) {
          optionElement.selected = "selected";
        }
        dropdown.appendChild(optionElement);
      });
      frame.appendChild(dropdown);
    } else if (option.RunFunction) {
      const buttonElement = document.createElement("button");
      buttonElement.innerText = "";
      buttonElement.style.backgroundImage = `url(img/icons/${option.Icon})`;
      frame.appendChild(buttonElement);

      if (option.FileInput) {
        const inputElement = document.createElement("input");
        inputElement.setAttribute("type", "file");
        inputElement.onchange = (event) => {
          option.RunFunction(event);
        }
        buttonElement.onclick = () => {
          inputElement.click();
        }
        frame.appendChild(inputElement);
      } else[
        buttonElement.onclick = () => {
          option.RunFunction();
        }
      ]
    }

    settingsList.appendChild(frame);
  }
}

updateLanguage(_currentLanguage).then(() => {
  initSettings(); // Build settings after translations are ready
});

window.toggleSettings = toggleSettings;