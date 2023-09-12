
// image optmization code here
let SITEID = "64f8c44ec0ed3efe8c8a1757";
const BASE_URL = "https://dc3b-2409-40f3-1008-3480-56a7-230-2778-f0c5.ngrok-free.app";
const imageConversionUrl = "https://8234-2409-40f3-100a-91e6-ad0e-cb3c-b765-c85b.ngrok-free.app/";
const authToken = "b4826e7558488175daf37ea2f398a00bc797013f583272756aae84333e8e45b9";

let imageSize = 0;
let optimizedImageSize = 0;

let collectionList = [];
let itemList = [];


   // Simulated API response data
   let apiData:any[] = [
    {
      id: 1,
      collectionName: "Collection 1",
      items: [
          { id: 1, displayName: "Item 1" },
          { id: 2, displayName: "Item 2" }
      ]
    },
    {
      id: 2,
      collectionName: "Collection 2",
      items: [
          { id: 3, displayName: "Item 3" },
          { id: 4, displayName: "Item 4" }
      ]
    }
];





async function fetchCMSDetails() {
  const collections = await fetch(`${BASE_URL}/getCollections?site_id=${SITEID}`, {
    method: 'GET',
    headers:{
      'authorization': `Bearer ${authToken}`,
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
  const r = await collections.json();
  const collectionList = r['collections']

  apiData = collectionList;


  collectionList.forEach(async(c,i) => {
    const itemList = await fetch(`${BASE_URL}/getCollectionDetails?collection_id=${c.id}`);
    const r = await itemList.json();

    apiData[i].items = r;
  })
}



// Function to create and populate the HTML
function populateHTML(data) {
    const accordionContainer = document.getElementById("accordionContainer");

    data.forEach((collection) => {
        const accordionItem = document.createElement("div");
        accordionItem.className = "border border-gray-300 rounded-lg";

        const title = document.createElement("div");
        title.className = "flex items-center justify-between p-3 cursor-pointer";
        title.innerHTML = `
            <h2 class="text-lg font-medium">${collection.collectionName}</h2>

        `;

        const content = document.createElement("div");
        content.className = "px-4 py-2 bg-gray-100 hidden";

        collection.items.forEach((item) => {
            const itemElement = document.createElement("div");
            itemElement.className = "flex items-center";
            itemElement.innerHTML = `
                <input type="checkbox" class="form-checkbox">
                <p class="ml-2"
                aria-data-id="${item.id}"
                >${item.displayName}</p>
            `;
            content.appendChild(itemElement);
        });

        accordionItem.appendChild(title);
        accordionItem.appendChild(content);


        // accordion show/hide functionality
        title.addEventListener("click", () => {
            if (content.classList.contains("hidden")) {
                content.classList.remove("hidden");
            } else {
                content.classList.add("hidden");
            }
        });

        accordionContainer.appendChild(accordionItem);
    });
}

// Function to handle the "Optimize" button click
document.getElementById("optimizeButton").addEventListener("click", () => {
    const selectedItems = [];

    // Iterate through the collections and their items to get selected checkboxes
    const collectionContainers = document.querySelectorAll(".border");
    collectionContainers.forEach((collectionContainer, index) => {
        const checkboxes = collectionContainer.querySelectorAll("input[type='checkbox']");
        const selectedItemsInCollection = Array.from(checkboxes)
            .filter((checkbox:any) => checkbox.checked)
            .map((checkbox) => ({
                collectionId: apiData[index].id,
                itemId: Number(checkbox.parentNode.querySelector("p").getAttribute("aria-data-id")),
                itemName: checkbox.parentNode.querySelector("p").innerText
            }));
        selectedItems.push(...selectedItemsInCollection);
    });

    // Perform your post request with selectedItems data
    console.log("Selected items for post request:", selectedItems);
    // Replace this with your actual post request logic

    const optimizedList = [
      {
        "image": "https://uploads-ssl.webflow.com/64fc87f8cf0e897a274996df/6500873be9135a4c4464878e_64fc8fe53fa71661e7116ffc_4k-3840-x-2160-wallpapers-themefoxx%252520(1).jpg.webp",
        "optimizedSize": 195416,
        "originalSize": 208560
      },
      {
        "image": "https://uploads-ssl.webflow.com/64fc87f8cf0e897a274996df/65002fab7c5d8668c49b7e7f_4k-3840-x-2160-wallpapers-themefoxx%20(19).jpg",
        "optimizedSize": 187964,
        "originalSize": 3218810
      },
      {
        "image": "https://uploads-ssl.webflow.com/64fc87f8cf0e897a274996df/6500919b7cb7731f8ebe846e_64fc901a5e6e8fbe171abc06_4k-3840-x-2160-wallpapers-themefoxx%252520(5).jpg.webp",
        "optimizedSize": 651032,
        "originalSize": 727072
      },
      {
        "image": "https://uploads-ssl.webflow.com/64fc87f8cf0e897a274996df/64fc900c8d10cc4bf23ce48a_4k-3840-x-2160-wallpapers-themefoxx%20(4).jpg",
        "optimizedSize": 502768,
        "originalSize": 2136476
      },
      {
        "image": "https://uploads-ssl.webflow.com/64fc87f8cf0e897a274996df/64fc901a5e6e8fbe171abc06_4k-3840-x-2160-wallpapers-themefoxx%20(5).jpg",
        "optimizedSize": 727072,
        "originalSize": 2289727
      },
      {
        "image": "https://uploads-ssl.webflow.com/64fc87f8cf0e897a274996df/64fc902515ed201d5b92649c_4k-3840-x-2160-wallpapers-themefoxx%20(6).jpg",
        "optimizedSize": 1781050,
        "originalSize": 1862964
      },
      {
        "image": "https://uploads-ssl.webflow.com/64fc87f8cf0e897a274996df/64fc903a3a751695a4ae6693_4k-3840-x-2160-wallpapers-themefoxx%20(8).jpg",
        "optimizedSize": 1315422,
        "originalSize": 2951685
      },
      {
        "image": "https://uploads-ssl.webflow.com/64fc87f8cf0e897a274996df/6500604b21c0da978e1be05e_64fc904653f8909fc7c19cfa_4k-3840-x-2160-wallpapers-themefoxx%252520(9).jpg.webp",
        "optimizedSize": 403548,
        "originalSize": 434418
      },
      {
        "image": "https://uploads-ssl.webflow.com/64fc87f8cf0e897a274996df/650092867acc7a18b220f36b_4k-3840-x-2160-wallpapers-themefoxx%20(12).jpg",
        "optimizedSize": 544136,
        "originalSize": 2277951
      }
    ];


    document.querySelector('.optimize-result-container').classList.remove('hidden');



    let totalSize = 0;
    let optimizedSize = 0;

    optimizedList.forEach((item) => {
      totalSize += item.originalSize;
      optimizedSize += item.optimizedSize;
    });

    document.getElementById('from').innerText = formatBytes(totalSize);
    document.getElementById('to').innerText = formatBytes(optimizedSize);
});



// call CMS details

fetchCMSDetails();

// Populate the HTML with API data
populateHTML(apiData);



function formatBytes(bytes) {
  if (bytes < 1024) {
    return bytes + " B";
  } else if (bytes < 1048576) { // 1024 * 1024
    return (bytes / 1024).toFixed(2) + " KB";
  } else {
    return (bytes / 1048576).toFixed(2) + " MB";
  }
}