const BASE_URL = "https://5b0f-117-250-224-175.ngrok-free.app";
const authToken = "c8198eccbf8ea221296ab69908b346d2876aa1cfbed26efed3ea610861415f51";
const accordionContainer = document.getElementById("accordionContainer");
const optimizeButton = document.getElementById("optimizeButton");
const resultContainer = document.querySelector('.optimize-result-container');

let collectionList = [];

// Function to fetch data from the server
async function fetchData(endpoint, options = {}) {
  try {
    const response = await fetch(endpoint, options);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Function to create an HTML element
function createElement(tag, className = "") {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

// Function to toggle element visibility
function toggleVisibility(element) {
  element.classList.toggle("hidden");
}

// Function to create an accordion item
function createAccordionItem(collection, items) {
  const accordionItem = createElement("div", "border border-gray-300 rounded-lg");
  const title = createElement("div", "flex items-center justify-between p-3 cursor-pointer");
  title.innerHTML = `<h2 class="text-lg font-medium">${collection.displayName}</h2>`;

  const content = createElement("div", "px-4 py-2 bg-gray-100 hidden");

  items.forEach((item) => {
    const itemElement = createElement("div", "flex items-center");
    itemElement.innerHTML = `
      <input type="checkbox" class="form-checkbox">
      <p class="ml-2" aria-data-id="${item.id}">${item.displayName}</p>
    `;
    content.appendChild(itemElement);
  });

  accordionItem.appendChild(title);
  accordionItem.appendChild(content);

  // Accordion show/hide functionality
  title.addEventListener("click", () => toggleVisibility(content));

  return accordionItem;
}

// Function to handle the "Optimize" button click
optimizeButton.addEventListener("click", async () => {
  resultContainer.classList.add('hidden');
  const selectedItems = [];

  // Iterate through the collections and their items to get selected checkboxes
  const collectionContainers = document.querySelectorAll(".border") as any;

  for (const [index, collectionContainer] of collectionContainers.entries()) {
    const checkboxes = collectionContainer.querySelectorAll("input[type='checkbox']");
    const selectedItemsInCollection = Array.from(checkboxes)
      .filter((checkbox:any) => checkbox.checked)
      .map((checkbox: any) => ({
        collectionId: collectionList[index].id,
        itemId: checkbox.parentNode.querySelector("p").getAttribute("aria-data-id"),
        itemName: checkbox.parentNode.querySelector("p").innerText,
      }));
    selectedItems.push(...selectedItemsInCollection);
  }

  // Perform your post request with selectedItems data
  console.log("Selected items for post request:", selectedItems);
  // Replace this with your actual post request logic

  const uniqueCollections = [...new Set(selectedItems.map((item) => item.collectionId))];

  for (const collectionId of uniqueCollections) {
    const fields = selectedItems
      .filter((item) => item.collectionId === collectionId)
      .map((item) => item.itemName);
    console.log(fields);

    let bodyContent = JSON.stringify(fields);

    optimizeButton.innerText = 'Optimizing ✨✨✨';

    try {
      const response = await fetchData(`${BASE_URL}/optimizeItems?collection_id=${collectionId}`, {
        method: 'POST',
        headers: {
          'authorization': `Bearer ${authToken}`,
          'content-type': 'application/json',
        },
        body: bodyContent,
      });

      let totalSize = 0;
      let optimizedSize = 0;

      let optimizedImageList = response;

      resultContainer.classList.remove('hidden');

      optimizedImageList.forEach((item) => {
        totalSize += item.originalSize;
        optimizedSize += item.optimizedSize;
      });

      optimizeButton.innerText = 'Optimize';
      document.getElementById('from').innerText = formatBytes(totalSize);
      document.getElementById('to').innerText = formatBytes(optimizedSize);
    } catch (error) {
      console.error(error);
    }
  }
});

// Populate HTML on page load
async function populateHTML() {
  try {
    const siteInfo = await webflow.getSiteInfo();

    const collections = await fetchData(`${BASE_URL}/getCollections?site_id=${"64f8c44ec0ed3efe8c8a1757"}`, {
      headers: {
        'authorization': `Bearer ${authToken}`,
        'content-type': 'application/json',
      },
    });

    collectionList = collections.collections;

    for (const collection of collectionList) {
      const itemList = await fetchData(`${BASE_URL}/getCollectionDetails?collection_id=${collection.id}`, {
        headers: {
          'authorization': `Bearer ${authToken}`,
          'content-type': 'application/json',
        },
      });

      const accordionItem = createAccordionItem(collection, itemList);
      accordionContainer.appendChild(accordionItem);
    }
  } catch (error) {
    console.error(error);
  }
}

// Format bytes function
function formatBytes(bytes) {
  if (bytes < 1024) {
    return bytes + " B";
  } else if (bytes < 1048576) { // 1024 * 1024
    return (bytes / 1024).toFixed(2) + " KB";
  } else {
    return (bytes / 1048576).toFixed(2) + " MB";
  }
}

// Initialize the page
populateHTML();
