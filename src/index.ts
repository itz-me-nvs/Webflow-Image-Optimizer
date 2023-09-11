
// image optmization code here
let SITEID = "";
const imageConversionUrl = "https://8234-2409-40f3-100a-91e6-ad0e-cb3c-b765-c85b.ngrok-free.app/";
const authToken = "f48c0640be611f9137eaacf50459e0d38d092c690fbd12c89bcc53ce9fc4dab3";

let imageSize = 0;
let optimizedImageSize = 0;

// Helper function to make authenticated API requests
async function makeAuthenticatedRequest(url, method, body = null) {
  const headers = {
    accept: 'application/json',
    authorization: `Bearer ${authToken}`,
  };

  if (body) {
    headers['content-type'] = 'application/json';
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

// Helper function to calculate image size
async function calculateImageSize(url) {
  const imageFetch = await fetch(url);
  const blob = await imageFetch.blob();
  return blob.size;
}

// Helper function to convert an image to WebP and calculate optimized size
async function optimizeImage(imageUrl) {
  const webpImageUrl = await makeAuthenticatedRequest(imageConversionUrl, 'POST', {
    image_url: imageUrl,
  });

  const optimizedImageFetch = await fetch(webpImageUrl.image_url);
  const optimizedBlob = await optimizedImageFetch.blob();
  const optimizedSize = optimizedBlob.size;
  return { webpImageUrl: webpImageUrl.image_url, optimizedSize };
}

// Function to fetch collections and process items
async function processCollectionsAndItems() {
  try {
    // Fetch collections
    const collectionsResponse = await makeAuthenticatedRequest(`https://api.webflow.com/beta/sites/${SITEID}/collections`, 'GET');
    const collections = collectionsResponse.collections;

    for (const collection of collections) {
      const itemID = collection.id;

      // Fetch collection items
      const itemsResponse = await makeAuthenticatedRequest(`https://api.webflow.com/beta/collections/${itemID}/items`, 'GET');
      const items = itemsResponse.items;

      // Process items
      for (const item of items) {
        const imageUrl = item.fieldData.image.url;

        // Calculate image size
        const originalSize = await calculateImageSize(imageUrl);
        imageSize += originalSize;

        // Optimize image and calculate optimized size
        const { webpImageUrl, optimizedSize } = await optimizeImage(imageUrl);
        optimizedImageSize += optimizedSize;

        document.getElementById('optimizeBtn').innerText = 'Optimize Image'
        document.getElementById('status').innerText = `Image optimized from ${formatBytes(imageSize)} to ${formatBytes(optimizedImageSize)}.`

      }
    }
  } catch (err) {

    document.getElementById('optimizeBtn').innerText = 'Something went wrong!'

  }
}



function formatBytes(bytes) {
  if (bytes < 1024) {
    return bytes + " B";
  } else if (bytes < 1048576) { // 1024 * 1024
    return (bytes / 1024).toFixed(2) + " KB";
  } else {
    return (bytes / 1048576).toFixed(2) + " MB";
  }
}


document.getElementById("lorem").onsubmit = async (event) => {
  event.preventDefault()
  // const el = await webflow.getSelectedElement();

  const siteInfo = await webflow.getSiteInfo();
  console.log(siteInfo.siteId)

  SITEID = siteInfo.siteId;
  document.getElementById('optimizeBtn').innerText = 'Loading!..'
  processCollectionsAndItems();

}




