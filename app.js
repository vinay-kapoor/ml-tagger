

async function tagArticle() {


  const articleText = document.getElementById("articleInput").value;

  try {
      const response = await fetch('/tag', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ articleText })
      });

      const data = await response.json();
      document.getElementById("tagsOutput").innerText = data.tags;
  } catch (error) {
      console.error("Error:", error);
      document.getElementById("tagsOutput").innerText = "Error retrieving tags.";
  }
}