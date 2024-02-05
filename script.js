const template = document.getElementsByTagName("template")[0];
const rootElem = document.getElementById("root");
let allEpisodes
const api = 'https://api.tvmaze.com/shows/82'

// fetch data from tvmaze and setup the page
fetch(`${api}/episodes`)
  .then((response) => response.json())
  .then((data) => allEpisodes = data)
  .then(() => makePageForEpisodes(allEpisodes))
  .then(() => setupSearch());

// Set the correct series name
fetch(api)
  .then((response) => response.json())
  .then((data) => setSeriesName(data.name));

function setSeriesName(seriesName) {
  const seriesNameField = document.querySelector("#series-name");
  seriesNameField.innerText = seriesName;
}

function makePageForEpisodes(episodeList) {
  const episodeListHtml = makeEpisodeListHtml(episodeList)
  rootElem.append(episodeListHtml);
  updateEpisodeListCounter(episodeList);
}

function makeEpisodeListHtml(episodeList) {
  let episodeListHtml = document.querySelector(".episodes-list");
  const episodeCards = episodeList.map(makeEpisodeCard);

  // If there is a episode list, delete content. If not, clone from the template.
  episodeListHtml ? episodeListHtml.innerHTML = "" : episodeListHtml = template.content.querySelector(".episodes-list").cloneNode(true)

  episodeListHtml.append(...episodeCards);

  return episodeListHtml;
}

// Make the card
function makeEpisodeCard(episode) {
  const episodeCard = template.content.querySelector(".episode-card").cloneNode(true);
  const episodeName = episode.name;
  const episodeSeason = `${episode.season}`.padStart(2, "0");
  const episodeNumber = `${episode.number}`.padStart(2, "0");
  const episodeImage = episode.image.medium;
  const episodeSummary = episode.summary;

  const episodeTitle = `${episodeName} - S${episodeSeason}E${episodeNumber}`

  episodeCard.querySelector(".episode-card__title")
    .innerText = episodeTitle;

  episodeCard.querySelector(".episode-card__img").src = episodeImage || './No-Image-Placeholder.png';
  episodeCard.querySelector(".episode-card__summary").outerHTML = episodeSummary;

  return episodeCard;
}

function setupSearch() {
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.trim().toLowerCase();
    filterEpisodes(searchTerm);
  });
}

function filterEpisodes(searchTerm) {
  const filteredEpisodes = allEpisodes.filter(
    (episode) =>
      episode.name.toLowerCase().includes(searchTerm) ||
      episode.summary.toLowerCase().includes(searchTerm)
  );

  makePageForEpisodes(filteredEpisodes);
}

function updateEpisodeListCounter(episodeList) {
  const episodesDisplayAmount = document.querySelector(
    ".episodes-display-amount"
  );
  episodesDisplayAmount.textContent = `Displaying ${episodeList.length} out of ${allEpisodes.length} episodes`;
}


