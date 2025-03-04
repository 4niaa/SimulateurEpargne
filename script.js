// Gestion de l'authentification (simulation)
let isLoggedIn = false;
let currentUser = null;
let savedSimulations = [];

// Éléments du DOM
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loginModal = document.getElementById("loginModal");
const closeModal = document.querySelector(".close-modal");
const tabs = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".tab-content");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const userInfo = document.querySelector(".user-info");
const userAvatar = document.getElementById("userAvatar");
const userName = document.getElementById("userName");
const historySection = document.getElementById("historySection");
const savedSimulationsContainer = document.getElementById("savedSimulations");
const saveSimulationBtn = document.getElementById("saveSimulationBtn");

// Gestion des onglets dans la modal
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tabContents.forEach((tc) => tc.classList.remove("active"));

    tab.classList.add("active");
    document.getElementById(`${tab.dataset.tab}Tab`).classList.add("active");
  });
});

// Ouvrir/fermer la modal
loginBtn.addEventListener("click", () => {
  loginModal.style.display = "flex";
});

closeModal.addEventListener("click", () => {
  loginModal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === loginModal) {
    loginModal.style.display = "none";
  }
});

// Formulaire de connexion
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  // Simuler une connexion réussie
  login({
    name: email.split("@")[0],
    email: email,
  });
  loginModal.style.display = "none";
});

// Formulaire d'inscription
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  // Simuler une inscription réussie
  login({
    name: name,
    email: email,
  });
  loginModal.style.display = "none";
});

// Déconnexion
logoutBtn.addEventListener("click", () => {
  logout();
});

// Fonction de connexion
function login(user) {
  isLoggedIn = true;
  currentUser = user;
  loginBtn.style.display = "none";
  userInfo.style.display = "flex";
  userName.textContent = user.name;
  userAvatar.textContent = user.name.charAt(0).toUpperCase();
  historySection.style.display = "block";
  loadSavedSimulations();

  // Si une simulation est en cours, afficher le bouton de sauvegarde
  if (document.getElementById("resultat").style.display !== "none") {
    saveSimulationBtn.style.display = "block";
  }
}

// Fonction de déconnexion
function logout() {
  isLoggedIn = false;
  currentUser = null;
  loginBtn.style.display = "block";
  userInfo.style.display = "none";
  historySection.style.display = "none";
  saveSimulationBtn.style.display = "none";
}

// Charger les simulations sauvegardées (simulation)
function loadSavedSimulations() {
  // Simuler des données sauvegardées
  savedSimulations = [
    {
      id: 1,
      objectif: "Voyage au Japon",
      montant: 5000,
      dateLimite: "2026-06-30",
      tauxInteret: 1.5,
      versementInitial: 500,
      date: "2025-03-03",
    },
    {
      id: 2,
      objectif: "Nouvel ordinateur",
      montant: 1200,
      dateLimite: "2025-09-15",
      tauxInteret: 1.2,
      versementInitial: 200,
      date: "2025-03-01",
    },
  ];

  displaySavedSimulations();
}

// Afficher les simulations sauvegardées
function displaySavedSimulations() {
  if (savedSimulations.length === 0) {
    savedSimulationsContainer.innerHTML =
      "<p>Vous n'avez pas encore de simulations sauvegardées.</p>";
    return;
  }

  let html = '<div class="plan-comparison">';
  savedSimulations.forEach((sim) => {
    const dateObj = new Date(sim.dateLimite);
    const currentDate = new Date(sim.date);
    const diffTime = Math.abs(dateObj - currentDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = diffDays / 30; // approximation

    html += `
      <div class="plan-card">
        <h3 class="plan-title">${sim.objectif}</h3>
        <div class="plan-details">
          <p><strong>Montant cible:</strong> ${sim.montant} €</p>
          <p><strong>Date limite:</strong> ${new Date(
            sim.dateLimite
          ).toLocaleDateString()}</p>
          <p><strong>Versement mensuel:</strong> ${(
            (sim.montant - sim.versementInitial) /
            diffMonths
          ).toFixed(2)} €</p>
          <p><strong>Taux d'intérêt:</strong> ${sim.tauxInteret}%</p>
          <p><strong>Créée le:</strong> ${new Date(
            sim.date
          ).toLocaleDateString()}</p>
        </div>
        <button class="btn btn-sm" onclick="loadSimulation(${
          sim.id
        })">Voir détails</button>
      </div>
    `;
  });
  html += "</div>";

  savedSimulationsContainer.innerHTML = html;
}

// Charger une simulation sauvegardée
function loadSimulation(id) {
  const simulation = savedSimulations.find((sim) => sim.id === id);
  if (simulation) {
    document.getElementById("objectif").value = simulation.objectif;
    document.getElementById("montant").value = simulation.montant;
    document.getElementById("date").value = simulation.dateLimite;
    document.getElementById("tauxInteret").value = simulation.tauxInteret;
    document.getElementById("versementInitial").value =
      simulation.versementInitial;

    // Soumettre le formulaire automatiquement
    document.getElementById("epargne-form").dispatchEvent(new Event("submit"));

    // Faire défiler jusqu'au simulateur
    document
      .getElementById("simulateur")
      .scrollIntoView({ behavior: "smooth" });
  }
}

// Sauvegarder une simulation
saveSimulationBtn.addEventListener("click", () => {
  if (!isLoggedIn) {
    loginModal.style.display = "flex";
    return;
  }

  const objectif = document.getElementById("objectif").value;
  const montant = parseFloat(document.getElementById("montant").value);
  const dateLimite = document.getElementById("date").value;
  const tauxInteret = parseFloat(document.getElementById("tauxInteret").value);
  const versementInitial = parseFloat(
    document.getElementById("versementInitial").value
  );

  const newSimulation = {
    id: savedSimulations.length + 1,
    objectif,
    montant,
    dateLimite,
    tauxInteret,
    versementInitial,
    date: new Date().toISOString().split("T")[0],
  };

  savedSimulations.push(newSimulation);
  displaySavedSimulations();

  // Faire défiler jusqu'aux simulations sauvegardées
  historySection.scrollIntoView({ behavior: "smooth" });

  alert("Simulation sauvegardée avec succès !");
});

// Gestion du simulateur d'épargne
document
  .getElementById("epargne-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Récupérer les valeurs
    const objectif = document.getElementById("objectif").value;
    const montant = parseFloat(document.getElementById("montant").value);
    const dateLimite = document.getElementById("date").value;
    const versementInitial =
      parseFloat(document.getElementById("versementInitial").value) || 0;

    if (!objectif || isNaN(montant) || !dateLimite) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const currentDate = new Date();
    const targetDate = new Date(dateLimite);

    if (targetDate <= currentDate) {
      alert("La date limite doit être dans le futur.");
      return;
    }

    // Calculer la différence en jours et approximativement en mois
    const diffTime = Math.abs(targetDate - currentDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = diffDays / 30; // approximation

    // Montant à épargner sans les intérêts
    const montantAEpargner = montant - versementInitial;
    let montantMensuelSansInteret = montantAEpargner / diffMonths;

    // Générer les données pour le graphique et les comparaisons
    const planStandard = generatePlanData(
      versementInitial,
      montantMensuelSansInteret,
      diffMonths
    );

    // Afficher le résultat
    const resultatDiv = document.getElementById("resultat");
    resultatDiv.innerHTML = `
    <h3>Plan d'épargne pour "${objectif}"</h3>
    <p>Pour atteindre votre objectif de <strong>${montant.toLocaleString()}€</strong> d'ici le <strong>${targetDate.toLocaleDateString()}</strong>:</p>
    <ul>
      <li>Durée: <strong>${Math.round(diffMonths)} mois</strong> (environ ${
      Math.round((diffMonths / 12) * 10) / 10
    } ans)</li>
      <li>Versement initial: <strong>${versementInitial.toLocaleString()}€</strong></li>
      <li>Versement mensuel recommandé: <strong>${montantMensuelSansInteret.toFixed(
        2
      )}€</strong></li>
      <li>Total des versements: <strong>${(
        versementInitial +
        montantMensuelSansInteret * diffMonths
      ).toFixed(2)}€</strong></li>
    </ul>
  `;
    resultatDiv.style.display = "block";

    // Afficher le graphique
    createChart(planStandard);
    document.getElementById("graphContainer").style.display = "block";

    // Afficher les comparaisons de plans
    displayPlanComparison(planStandard);
    document.getElementById("planComparison").style.display = "grid";

    // Afficher le bouton de sauvegarde si l'utilisateur est connecté
    if (isLoggedIn) {
      saveSimulationBtn.style.display = "block";
    }
  });

// Générer les données du plan
function generatePlanData(versementInitial, versementMensuel, nombreMois) {
  const data = [];
  let solde = versementInitial;

  for (let i = 0; i <= nombreMois; i++) {
    data.push({
      mois: i,
      solde: solde,
    });

    // Ajouter le versement mensuel
    solde += versementMensuel;
  }

  return {
    versementInitial,
    versementMensuel,
    nombreMois,
    montantFinal: solde,
    data,
  };
}

// Créer le graphique d'évolution
function createChart(planStandard) {
  const ctx = document.getElementById("graphContainer");

  // Détruire le graphique existant s'il y en a un
  if (window.simulationChart) {
    window.simulationChart.destroy();
  }

  // Créer le graphique avec Chart.js
  window.simulationChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: planStandard.data
        .map((d) => `Mois ${d.mois}`)
        .filter(
          (_, i) =>
            i % Math.ceil(planStandard.data.length / 10) === 0 ||
            i === planStandard.data.length - 1
        ),
      datasets: [
        {
          label: "Plan standard (sans intérêts)",
          data: planStandard.data
            .map((d) => d.solde)
            .filter(
              (_, i) =>
                i % Math.ceil(planStandard.data.length / 10) === 0 ||
                i === planStandard.data.length - 1
            ),
          borderColor: "#6a1b9a",
          backgroundColor: "rgba(106, 27, 154, 0.1)",
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: "Mois",
          },
        },
        y: {
          title: {
            display: true,
            text: "Solde (€)",
          },
        },
      },
    },
  });
}

// Afficher les comparaisons de plans
function displayPlanComparison(planStandard) {
  const planComparisonDiv = document.getElementById("planComparison");
  planComparisonDiv.innerHTML = `
    <div class="plan-card">
      <h3 class="plan-title">Plan standard (sans intérêts)</h3>
      <div class="plan-details">
        <p><strong>Versement initial:</strong> ${planStandard.versementInitial.toLocaleString()}€</p>
        <p><strong>Versement mensuel:</strong> ${planStandard.versementMensuel.toFixed(
          2
        )}€</p>
        <p><strong>Durée:</strong> ${planStandard.nombreMois} mois</p>
        <p><strong>Montant final:</strong> ${planStandard.montantFinal.toFixed(
          2
        )}€</p>
      </div>
    </div>
  `;
}
