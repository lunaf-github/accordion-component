// code

const state = {
    multipleSelect: false,
    accordianDisplay: [],
    singleExpanded: 1
  }

function updateDescState(index, description, expandedIcon, collapsedIcon) {
    if (state.accordianDisplay[index]) {
      state.accordianDisplay[index]? state.accordianDisplay[index] = true : state.accordianDisplay[index] = false;
    } else {
        console.log(state.accordianDisplay)
      state.accordianDisplay.fill(false)
      state.accordianDisplay = index;
    }
    updateDOM(index, description, expandedIcon, collapsedIcon);
  }


  // error: state.accordianDisplay.fill is not a function

/**
 * Findings:
 *  In line 15, I overwrote the state.accordianDisplay array with the index
 * 
 * Solution:
 *  line 10, I needed to check if muliSelect was checked
 *  line 15, set the singleEpanded to the index, and set the singleExpanded 
 *  to true inside the accordianDisplay array
 *  */ 

// leasons learned: 
// 1. instead of using a tenerary for changing state to the oposite value, use the negate
// From: 
state.accordianDisplay[index]? state.accordianDisplay[index] = false : state.accordianDisplay[index] = true;
// To
state.accordianDisplay[index] =  !state.accordianDisplay[index];


// 2. I can improve the readability of updateDOM 
// from: 
function updateDOM(accordianSetionItems) {
    accordianSetionItems.forEach((section, index) => {
      const { description, expandedIcon, collapsedIcon } = section;
      if (state.accordianDisplay[index]) {
        description.style.display = 'block';
        expandedIcon.style.display = 'none';
        collapsedIcon.style.display = 'block';
      } else {
        description.style.display = 'none';
        expandedIcon.style.display = 'block';
        collapsedIcon.style.display = 'none';
      }
    })
  }

  // To:
  function updateDOM(accordianSetionItems) {
    accordianSetionItems.forEach(({ description, expandedIcon, collapsedIcon }, index) => {
      const isExpanded = state.accordianDisplay[index];
      description.style.display = isExpanded ? 'block' : 'none';
      expandedIcon.style.display = isExpanded ? 'none' : 'block';
      collapsedIcon.style.display = isExpanded ? 'block' : 'none';
    });
  }

  /**
   * Avoid Using new Array() for Initialization:
   * Instead of new Array(accordionSections.length).fill(false), you can use the Array.from 
   * method or a simple loop for array initialization. This can make your code more concise 
   * and readable
   * 
   * 
   */
