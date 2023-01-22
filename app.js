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
    items: [
      // { id: 0, name: "Steak Dinner", calories: 1200 },
      // { id: 1, name: "Cookie", calories: 400 },
      // { id: 2, name: "Eggs", calories: 300 },
    ],
    currentItem: null,
    totalCalories: 0,
  };
  // Public methods
  return {
    addItem: function (name, calories) {
      let id;
      if (data.items.length > 0) {
        id = data.items[data.items.length - 1].id + 1;
      } else {
        id = 0;
      }
      newItem = new Item(id, name, parseInt(calories));
      data.items.push(newItem);
      return newItem;
    },
    getItemById: function (id) {
      return this.getItems().find((a) => a.id == id);
    },
    udpateItem: function (itemName, itemCalories) {
      itemCalories = parseInt(itemCalories);

      let found = null;

      data.items.forEach(item => {
        if (item.id == data.currentItem.id) {
          item.name = itemName;
          item.calories = itemCalories
          found = item;
        }
      })
      return found;
    },
    getItems: function () {
      return data.items;
    },
    getTotalCalories: function () {
      let totalCalories = 0;
      data.items.forEach((item, index) => {
        totalCalories += item.calories;
      });
      data.totalCalories = totalCalories;
      return data.totalCalories;
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    logData: function () {
      return data;
    },
  };
})();

// UI Controller
const UICtrl = (function () {
  const UISelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories",
  };

  // Public methods
  return {
    populateItemList: function (items) {
      let html = "";
      items.forEach(function (item) {
        html += `
          <li id="item-${item.id}" class="collection-item">
            <strong>${item.name}: </strong>
            <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="fa fa-pencil"></i>
            </a>
          </li>
        `;
      });
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    addListItem: function (item) {
      // Show list
      this.showList();
      // Create li element
      const li = document.createElement("li");
      li.className = "collection-item";
      li.id = `item-${item.id}`;
      li.innerHTML = `
        <strong>${item.name}: </strong>
        <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      `;
      document.querySelector(UISelectors.itemList).insertAdjacentElement("beforeend", li);
    },
    addItemToForm: function () {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.addBtn).style.display = "inline";
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
    },
    showEditState: function () {
      document.querySelector(UISelectors.addBtn).style.display = "none";
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
    },
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      };
    },
    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      listItems = Array.from(listItems);
      listItems.forEach(listItem => {
        const itemID = listItem.getAttribute('id');

        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `
          <strong>${item.name}: </strong>
          <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
          `
        }

      })
    },
    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    showList: function () {
      document.querySelector(UISelectors.itemList).style.display = "block";
    },
    getUISelectors: function () {
      return UISelectors;
    },
  };
})();

// App Controller
const App = (function (ItemCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = function () {
    // Get UI selectors
    const UISelectors = UICtrl.getUISelectors();

    // Prevent submit on Enter
    document.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
      }
    });

    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit);

    // Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener("click", itemEditClick);

    document.querySelector(UISelectors.updateBtn).addEventListener("click", itemUpdateSubmit);
  };

  // Add item submit
  const itemAddSubmit = function (event) {
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();

    // Check for name and calories input
    if (input.name !== "" && input.calories !== "") {
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Add item to UI list
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to the UI
      UICtrl.showTotalCalories(totalCalories);

      // Clear fields
      UICtrl.clearInput();
    }

    event.preventDefault();
  };

  // Click Edit item
  const itemEditClick = function (event) {
    if (event.target.classList.contains("edit-item")) {
      // Get list item class
      const listClass = event.target.parentNode.parentNode.id;

      // Get list item id number
      const listIdNumber = parseInt(listClass.split("-")[1]);

      // Get item
      const itemToEdit = ItemCtrl.getItemById(listIdNumber);

      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      UICtrl.addItemToForm();
    }
    event.preventDefault();
  };

  // Click update item
  const itemUpdateSubmit = function (event) {

    const itemToUpdate = UICtrl.getItemInput();

    const updatedItem = ItemCtrl.udpateItem(itemToUpdate.name, itemToUpdate.calories);

    UICtrl.updateListItem(updatedItem);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories to the UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();

    event.preventDefault();
  };

  // Public methods
  return {
    init: function () {
      // Clear edit state / set initial set
      UICtrl.clearEditState();

      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate list with items
        UICtrl.populateItemList(items);
      }

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to the UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    },
  };
})(ItemCtrl, UICtrl);

App.init();
