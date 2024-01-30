const Accordion = (function(){
  
  const state = {
    multipleSelect: false,
    accordionDisplay: [],
    singleExpanded: 0
  }

  function INIT(accordionSections) {
    state.accordionDisplay = Array.from({ length: accordionSections.length }, () => false);
    state.accordionDisplay[state.singleExpanded] = true;
  }
  
  function toggleSectionState(index) {
    if (state.multipleSelect) {
      state.accordionDisplay[index] =  !state.accordionDisplay[index];
    } else {
      toggleSingleSelect(index);
    }
  }

  function toggleSingleSelect(index) {
    if (index === state.singleExpanded && state.accordionDisplay[index]) {
      state.accordionDisplay.fill(false);
    } else {
      state.singleExpanded = index;
      state.accordionDisplay.fill(false);
      state.accordionDisplay[state.singleExpanded] = true;
    }
  }
  
  function enableMultiple(value) {
    state.multipleSelect = value;
  }

  function updateDOM(accordionSetionItems) {
    accordionSetionItems.forEach(({ description, expandedIcon, collapsedIcon }, index) => {
      const isExpanded = state.accordionDisplay[index];
      description.style.display = isExpanded ? 'block' : 'none';
      expandedIcon.style.display = isExpanded ? 'none' : 'block';
      collapsedIcon.style.display = isExpanded ? 'block' : 'none';
    });
  }
  
  return { INIT, toggleSectionState, enableMultiple, updateDOM};
})()


document.addEventListener('DOMContentLoaded', () => {
  
  const multiSelect = document.getElementById('multiselect');
  const accordionSections = document.querySelectorAll('.accordion');
  const accordionSetionItems = [];

  accordionSections.forEach((accordionSection, index) => {
    
    const description = accordionSection.querySelector('.description');
    const expandedIcon = accordionSection.querySelector('.expand-icon');
    const collapsedIcon = accordionSection.querySelector('.collapse-icon');
    
    accordionSetionItems.push({description, expandedIcon, collapsedIcon});
    
    accordionSection.addEventListener('click', () => {
      Accordion.toggleSectionState(index);
      Accordion.updateDOM(accordionSetionItems);
    })    
  });

  multiSelect.addEventListener('click', (event) => {
     Accordion.enableMultiple(event.target.checked);
  })
  
  Accordion.INIT(accordionSections);
  Accordion.updateDOM(accordionSetionItems);

});