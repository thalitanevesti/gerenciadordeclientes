// Lista temporária de produtos e logo no formulário
let tempProducts = [];
let tempLogo = null;
let editingClientId = null;

// Inicializa a lista de clientes do localStorage ou array vazio
let clients = JSON.parse(localStorage.getItem("clients")) || [];

// Função para salvar clientes no localStorage
function saveClients() {
  localStorage.setItem("clients", JSON.stringify(clients));
}

// Função para visualizar o logo carregado
function previewLogo() {
  const logoInput = document.getElementById("logoInput");
  const logoPreview = document.getElementById("logoPreview");
  const error = document.getElementById("errorMessage");

  if (logoInput.files && logoInput.files[0]) {
    const file = logoInput.files[0];
    if (!file.type.startsWith("image/")) {
      error.textContent = "Por favor, selecione um arquivo de imagem";
      error.classList.add("error");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      tempLogo = e.target.result;
      logoPreview.innerHTML = `<img src="${tempLogo}" alt="Logo Preview">`;
      error.textContent = "";
    };
    reader.readAsDataURL(file);
  } else {
    error.textContent = "Nenhum arquivo selecionado";
    error.classList.add("error");
  }
}

// Função para adicionar produto ao formulário
function addProductToForm() {
  const productName = document.getElementById("productName").value.trim();
  const productPrice = parseFloat(
    document.getElementById("productPrice").value
  );
  const error = document.getElementById("errorMessage");

  if (!productName || isNaN(productPrice) || productPrice <= 0) {
    error.textContent = "Nome do produto e preço válido são obrigatórios";
    error.classList.add("error");
    return;
  }

  tempProducts.push({ name: productName, price: productPrice });
  updateProductList();
  document.getElementById("productName").value = "";
  document.getElementById("productPrice").value = "";
  error.textContent = "";
}

// Função para atualizar a lista de produtos no formulário
function updateProductList() {
  const productList = document.getElementById("productList");
  productList.innerHTML = "";
  tempProducts.forEach((product) => {
    const li = document.createElement("li");
    li.textContent = `${product.name} - R$ ${product.price.toFixed(2)}`;
    productList.appendChild(li);
  });
}

// Função para adicionar ou atualizar cliente
function addClient() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const city = document.getElementById("city").value.trim();
  const state = document.getElementById("state").value.trim();
  const zip = document.getElementById("zip").value.trim();
  const notes = document.getElementById("notes").value.trim();
  const error = document.getElementById("errorMessage");

  // Validação básica
  if (!name) {
    error.textContent = "O nome é obrigatório";
    error.classList.add("error");
    return;
  }

  // Cria objeto do cliente
  const client = {
    id: editingClientId || Date.now(),
    name,
    email,
    phone,
    address,
    city,
    state,
    zip,
    notes,
    products: [...tempProducts],
    logo: tempLogo,
  };

  if (editingClientId) {
    // Atualiza cliente existente
    const index = clients.findIndex((c) => c.id == editingClientId);
    clients[index] = client;
    error.textContent = "Cliente atualizado com sucesso!";
  } else {
    // Adiciona novo cliente
    clients.push(client);
    error.textContent = "Cliente adicionado com sucesso!";
  }

  // Salva e atualiza
  saveClients();
  updateClientList();
  clearForm();

  error.classList.remove("error");
  error.classList.add("success");
  setTimeout(() => {
    error.textContent = "";
    error.classList.remove("success");
  }, 2000);
}

// Função para limpar o formulário
function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("address").value = "";
  document.getElementById("city").value = "";
  document.getElementById("state").value = "";
  document.getElementById("zip").value = "";
  document.getElementById("notes").value = "";
  document.getElementById("logoInput").value = "";
  document.getElementById("logoPreview").innerHTML = "";
  document.getElementById("productName").value = "";
  document.getElementById("productPrice").value = "";
  document.getElementById("productList").innerHTML = "";
  document.getElementById("formTitle").textContent = "Adicionar Novo Cliente";
  document.getElementById("submitButton").textContent = "Adicionar Cliente";
  document.getElementById("cancelEditButton").style.display = "none";
  tempProducts = [];
  tempLogo = null;
  editingClientId = null;
}

// Função para atualizar a lista de clientes
function updateClientList() {
  const clientList = document.getElementById("clientList");
  const clientTableBody = document.getElementById("clientTableBody");

  // Limpa a lista e a tabela
  clientList.innerHTML = '<option value="">Selecione um cliente</option>';
  clientTableBody.innerHTML = "";

  // Popula a lista e a tabela
  clients.forEach((client) => {
    // Adiciona ao select
    const option = document.createElement("option");
    option.value = client.id;
    option.textContent = client.name;
    clientList.appendChild(option);

    // Adiciona à tabela
    const row = document.createElement("tr");
    row.innerHTML = `
            <td class="border p-3">${client.name}</td>
            <td class="border p-3">${client.email || "-"}</td>
            <td class="border p-3">${client.phone || "-"}</td>
            <td class="border p-3">${client.city || "-"}</td>
        `;
    clientTableBody.appendChild(row);
  });

  // Limpa a seção de informações do cliente
  document.getElementById("clientInfo").style.display = "none";
}

// Função para exibir informações do cliente selecionado
function displayClientInfo() {
  const clientList = document.getElementById("clientList");
  const clientId = clientList.value;
  const clientInfo = document.getElementById("clientInfo");

  if (!clientId) {
    clientInfo.style.display = "none";
    return;
  }

  const client = clients.find((c) => c.id == clientId);
  if (client) {
    document.getElementById("infoName").textContent = client.name;
    document.getElementById("infoEmail").textContent = client.email || "-";
    document.getElementById("infoPhone").textContent = client.phone || "-";
    document.getElementById("infoAddress").textContent = client.address || "-";
    document.getElementById("infoCity").textContent = client.city || "-";
    document.getElementById("infoState").textContent = client.state || "-";
    document.getElementById("infoZip").textContent = client.zip || "-";
    document.getElementById("infoNotes").textContent = client.notes || "-";

    const infoProducts = document.getElementById("infoProducts");
    infoProducts.innerHTML = "";
    client.products.forEach((product) => {
      const li = document.createElement("li");
      li.textContent = `${product.name} - R$ ${product.price.toFixed(2)}`;
      infoProducts.appendChild(li);
    });

    const infoLogo = document.getElementById("infoLogo");
    infoLogo.innerHTML = client.logo
      ? `<img src="${client.logo}" alt="Logo do Cliente">`
      : "Nenhum logo carregado";

    clientInfo.style.display = "block";
  }
}

// Função para editar cliente
function editClient() {
  const clientList = document.getElementById("clientList");
  const clientId = clientList.value;
  const error = document.getElementById("errorMessage");

  if (!clientId) {
    error.textContent = "Selecione um cliente para editar";
    error.classList.add("error");
    return;
  }

  const client = clients.find((c) => c.id == clientId);
  if (client) {
    // Preenche o formulário com os dados do cliente
    document.getElementById("name").value = client.name;
    document.getElementById("email").value = client.email || "";
    document.getElementById("phone").value = client.phone || "";
    document.getElementById("address").value = client.address || "";
    document.getElementById("city").value = client.city || "";
    document.getElementById("state").value = client.state || "";
    document.getElementById("zip").value = client.zip || "";
    document.getElementById("notes").value = client.notes || "";
    document.getElementById("logoPreview").innerHTML = client.logo
      ? `<img src="${client.logo}" alt="Logo Preview">`
      : "";
    tempProducts = [...client.products];
    tempLogo = client.logo;
    editingClientId = client.id;

    // Atualiza o título e botão do formulário
    document.getElementById("formTitle").textContent = "Editar Cliente";
    document.getElementById("submitButton").textContent = "Salvar Alterações";
    document.getElementById("cancelEditButton").style.display = "inline-block";
    updateProductList();
    error.textContent = "";
  }
}

// Função para excluir cliente
function deleteClient() {
  const clientList = document.getElementById("clientList");
  const clientId = clientList.value;
  const error = document.getElementById("errorMessage");

  if (!clientId) {
    error.textContent = "Selecione um cliente para excluir";
    error.classList.add("error");
    return;
  }

  if (confirm("Tem certeza que deseja excluir este cliente?")) {
    clients = clients.filter((c) => c.id != clientId);
    saveClients();
    updateClientList();
    document.getElementById("clientInfo").style.display = "none";
    error.textContent = "Cliente excluído com sucesso!";
    error.classList.remove("error");
    error.classList.add("success");
    setTimeout(() => {
      error.textContent = "";
      error.classList.remove("success");
    }, 2000);
  }
}

// Função para gerar PDF com as informações do cliente selecionado
function generatePDF() {
  const clientList = document.getElementById("clientList");
  const clientId = clientList.value;

  if (!clientId) {
    alert("Selecione um cliente para gerar o PDF.");
    return;
  }

  const client = clients.find((c) => c.id == clientId);
  if (client) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Adiciona logo, se disponível
    let y = 20;
    if (client.logo) {
      try {
        doc.addImage(client.logo, "PNG", 20, y, 50, 50); // Logo com 50x50 pixels
        y += 60;
      } catch (e) {
        console.error("Erro ao adicionar logo ao PDF:", e);
      }
    }

    // Configurações do PDF
    doc.setFontSize(16);
    doc.text("Ficha do Cliente", 20, y);
    y += 20;
    doc.setFontSize(12);
    doc.text(`Nome: ${client.name}`, 20, y);
    y += 10;
    doc.text(`E-mail: ${client.email || "-"}`, 20, y);
    y += 10;
    doc.text(`Telefone: ${client.phone || "-"}`, 20, y);
    y += 10;
    doc.text(`Endereço: ${client.address || "-"}`, 20, y);
    y += 10;
    doc.text(`Cidade: ${client.city || "-"}`, 20, y);
    y += 10;
    doc.text(`Estado: ${client.state || "-"}`, 20, y);
    y += 10;
    doc.text(`CEP: ${client.zip || "-"}`, 20, y);
    y += 10;
    doc.text(`Observações: ${client.notes || "-"}`, 20, y);
    y += 10;
    doc.text("Produtos Comprados:", 20, y);
    y += 10;

    // Adiciona produtos
    client.products.forEach((product) => {
      doc.text(`${product.name}: R$ ${product.price.toFixed(2)}`, 20, y);
      y += 10;
    });

    // Adiciona informações da empresa e data
    doc.setFontSize(10);
    doc.text(
      `Gerado por: Sergio Luiz Soluções Inteligentes | Data: ${new Date().toLocaleDateString(
        "pt-BR"
      )}`,
      20,
      y + 10
    );

    // Salva o PDF
    doc.save(`ficha_cliente_${client.name}.pdf`);
  }
}

// Inicializa a lista de clientes ao carregar a página
updateClientList();
