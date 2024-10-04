// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCzYNZNSqCZkvtzqC8-JIIKExtGVKJC6tc",
  authDomain: "marketsrc-cb564.firebaseapp.com",
  databaseURL: "https://marketsrc-cb564-default-rtdb.firebaseio.com",
  projectId: "marketsrc-cb564",
  storageBucket: "marketsrc-cb564.appspot.com",
  messagingSenderId: "929727087008",
  appId: "1:929727087008:web:d6bd0c309c54da5b1f64c5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const storage = firebase.storage();
const businessList = document.getElementById('business-list');
const businessForm = document.getElementById('business-form');

// Verificar inicialização do Firebase
console.log("Firebase inicializado:", firebase.apps.length > 0);

// Display businesses
db.ref('businesses').on('value', (snapshot) => {
  console.log("Dados recebidos do Firebase:", snapshot.val());
  businessList.innerHTML = ''; // Clear the list
  snapshot.forEach((childSnapshot) => {
    const business = childSnapshot.val();
    const div = document.createElement('div');
    div.className = 'business-card';
    div.innerHTML = `
      <h3>${business.name}</h3>
      <p>Endereço: ${business.address}</p>
      <img src="${business.photoURL}" alt="Foto da Empresa">
      <button onclick="window.open('https://wa.me/${business.whatsapp}', '_blank')">Conversar</button>`;
    businessList.appendChild(div);
  });
}, (error) => {
  console.error("Erro ao buscar dados:", error);
});

// Add new business
businessForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const address = document.getElementById('address').value;
  const whatsapp = document.getElementById('whatsapp').value;
  const photo = document.getElementById('photo').files[0];

  if (name && address && whatsapp && photo) {
    const newBusinessRef = db.ref('businesses').push();
    const storageRef = storage.ref('business_photos/' + newBusinessRef.key + '/' + photo.name);

    storageRef.put(photo).then((snapshot) => {
      snapshot.ref.getDownloadURL().then((photoURL) => {
        newBusinessRef.set({
            name: name,
            address: address,
            whatsapp: whatsapp,
            photoURL: photoURL
          })
          .then(() => {
            console.log("Novo negócio adicionado com sucesso.");
          })
          .catch((error) => {
            console.error("Erro ao adicionar novo negócio:", error);
          });
      });
    });

    businessForm.reset();
    console.log("Novo negócio adicionado:", { name, address, whatsapp });
  }
});