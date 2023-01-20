// Storage Controller

// Item Controller
const ItemCtrl = (function () {
  // Item constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };
  // Data structure / State
  const data = {
    item: [
      { id: 0, name: "Steak Dinner", calories: 1200 },
      { id: 0, name: "Cookie", calories: 400 },
      { id: 0, name: "Eggs", calories: 300 },
    ],
    currentItem: null,
    totalCalories: 0,
  };
  // Public methods
  return {
    logData: function () {
      return data;
    },
  };
})();

// UI Controller
const UICtrl = (function () {
  // Public methods
  return {};
})();

// App Controller
const App = (function (ItemCtrl, UICtrl) {
  // Public methods
  return {
    init: function () {
      console.log("Initializing app...");
    },
  };
})(ItemCtrl, UICtrl);

App.init();
