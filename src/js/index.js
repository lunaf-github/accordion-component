
const Accordian = (function(config) {
  // setup DOM refs
  const accordianSections = document.querySelectorAll('.accordion');
  const multiSelectCheckbox = document.getElementById('multiselect');
  const accordianSectionItems = [];
  accordianSections.forEach(section => {
    const titleSection = section.querySelector('.title-section');
    const expandIcon = section.querySelector('.expand-icon');
    const collapseIcon = section.querySelector('.collapse-icon');
    const description = section.querySelector('.description');
    accordianSectionItems.push({ expandIcon, collapseIcon, description, titleSection });
  });

  // setup component default state
  let state = {
    descriptionStates: Array.from({ length: accordianSections.length }, () => false),
    multiSelect: false,
  } 

  function init() {
    const userState = getLocalStorage();

    // state updates
    if (userState) {
      state = userState;
    } else {
      setDescriptionState(config.defaultOpen, true);
      initLocalStorage(state);
    }

    (state.multiSelect)? showCheckMark() : hideCheckMark();

    // update display based on state
    getAlldescriptionStates().forEach((isOpen, index) => {
      isOpen? openSection(index) : closeSection(index);
    })
  }

  // local storage getter and setters
  function initLocalStorage(state) {
    localStorage.setItem('componentState', JSON.stringify(state));
  }

  function getLocalStorage() {
    return JSON.parse(localStorage.getItem('componentState'));
  }
  
  function setDescriptionStateLocalStorage(index, value) {
    const storage = getLocalStorage();
    if (typeof index === 'number' && typeof value === 'boolean' && storage) {
      storage.descriptionStates[index] = value;
      localStorage.setItem("componentState", JSON.stringify(storage));
    }
  }

  function setMultiSelectStateLocalStorage(value) {
    const storage = getLocalStorage();
    if (typeof value === 'boolean' && storage) {
      storage.multiSelect = value;
      localStorage.setItem('componentState', JSON.stringify(storage));
    }
  }

  function setAllDescriptionStatesLocalStorage(value) {
    const storage = getLocalStorage();

    if (typeof value === 'boolean' && storage) {
      storage.descriptionStates.forEach((description, index) => {
        setDescriptionStateLocalStorage(index, value)
      });
    }
  }


  // state getter and setter methods
  function getMultiSelect() {
    return state.multiSelect;
  }
  
  function getAlldescriptionStates() {
    return [...state.descriptionStates];
  }

  function setDescriptionState(index, value) {
    if (typeof index === 'number' && typeof value === 'boolean') {
      state.descriptionStates[index] = value;
    }
  }

  function setMultiSelect(value) {
    if (typeof value === 'boolean') {
      state.multiSelect = value;
    }
  }

  function setAllDescriptionStates(value) {
    if (typeof value === 'boolean') {
      state.descriptionStates.fill(value);
    }
  }

  // DOM manipulation methods lower level
  function showDescription(index) {
    accordianSectionItems[index].description.style.display = 'block'
  }

  function hideDescription(index) {
    accordianSectionItems[index].description.style.display = 'none'
  }

  function showExpandIcon(index) {
    accordianSectionItems[index].expandIcon.style.display = 'block';
  }

  function hideExpandIcon(index) {
    accordianSectionItems[index].expandIcon.style.display = 'none';
  }

  function showCollapseIcon(index) {
    accordianSectionItems[index].collapseIcon.style.display = 'block';
  }

  function hideCollapseIcon(index) {
    accordianSectionItems[index].collapseIcon.style.display = 'none';
  }

  function showCheckMark() {
    multiSelectCheckbox.checked = true;
  }

  function hideCheckMark() {
    multiSelectCheckbox.checked = false;
  }

  function isVisibleDescription(index) {
    const description = accordianSectionItems[index].description;
    const status = description.style.display;
    return status === 'block';
  }
  
  function showAllExpendIcons() {
    accordianSectionItems.forEach((_, index) => {
      showExpandIcon(index);
    });
  };
  
  function hideAllDescriptions() {
    accordianSectionItems.forEach((_, index) => {
      hideDescription(index);
    });
  }

  function hideAllCollapseIcons() {
    accordianSectionItems.forEach((_, index) => {
      hideCollapseIcon(index);
    });
  }

  // Declarative methods
  function openSection(index) {
    showDescription(index); 
    showCollapseIcon(index); 
    hideExpandIcon(index);
    setDescriptionState(index, true);
    setDescriptionStateLocalStorage(index, true)
  }
  
  function closeSection(index) {
    hideDescription(index);
    hideCollapseIcon(index);
    showExpandIcon(index);
    setDescriptionState(index, false);
    setDescriptionStateLocalStorage(index, false)
  }

  function closeAllSections() {
    hideAllDescriptions();
    hideAllCollapseIcons();
    showAllExpendIcons();
    setAllDescriptionStates(false)
    setAllDescriptionStatesLocalStorage(false);
  }

  // event handlers
  function handleToggleDescription(index) {
    const isMutiSelect = getMultiSelect();
    const wasOpen = isVisibleDescription(index);

    if (!isMutiSelect) {
      closeAllSections();
    }

    if (wasOpen) {
      closeSection(index);
    }else {
      openSection(index);
    }
  }

  function handleToggleMultiSelect(event) {
    const isChecked = event.target.checked;
    setMultiSelect(isChecked);
    setMultiSelectStateLocalStorage(isChecked);
  }

  // setup events
  multiSelectCheckbox.addEventListener('click', handleToggleMultiSelect);
  accordianSectionItems.forEach((section, index) => {
    section.titleSection.addEventListener('click', () => handleToggleDescription(index))
  });

  return { init }

})({ defaultOpen: 0 })

document.addEventListener('DOMContentLoaded', Accordian.init)