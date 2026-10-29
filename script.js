const list = document.querySelector("#repository-list");
const status = document.querySelector("#status");
const count = document.querySelector("#repository-count");

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
}

function createRepositoryItem(repository) {
  const item = document.createElement("li");
  item.className = "repository";

  const topline = document.createElement("div");
  topline.className = "repository-topline";

  const link = document.createElement("a");
  link.href = repository.url;
  link.textContent = `${repository.owner}/${repository.name}`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  const stars = document.createElement("span");
  stars.className = "stars";
  stars.textContent = `${repository.stars.toLocaleString()} stars`;
  topline.append(link, stars);

  const description = document.createElement("p");
  description.className = "description";
  description.textContent = repository.description;

  const metadata = document.createElement("div");
  metadata.className = "repository-meta";

  const language = document.createElement("span");
  language.className = "language";
  language.textContent = repository.language;

  const date = document.createElement("span");
  date.textContent = `Starred ${formatDate(repository.starred_at)}`;
  metadata.append(language, date);

  item.append(topline, description, metadata);
  return item;
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories)) {
      throw new Error("Repository data must be a list");
    }

    list.replaceChildren(...repositories.map(createRepositoryItem));
    count.textContent = `${repositories.length} repositories`;
    status.textContent = repositories.length ? "" : "No starred repositories yet.";
  } catch (error) {
    status.textContent = "Repositories could not be loaded. Please try again later.";
    console.error("Could not load repositories:", error);
  }
}

loadRepositories();