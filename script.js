let clients = JSON.parse(localStorage.getItem("clients")) || [];
let currentClientProducts = [];
let currentClientLogo = null;
let editingClientId = null;

const messageDiv = document.getElementById("message");

// Função para exibir mensagens (sucesso/erro)
function showMessage(msg, type) {
  messageDiv.textContent = msg;
  messageDiv.className = `mb-4 p-3 rounded text-center ${type}`;
  messageDiv.style.display = "block";
  setTimeout(() => {
    messageDiv.style.display = "none";
  }, 3000);
}

// Função para salvar clientes no localStorage
function saveClients() {
  localStorage.setItem("clients", JSON.stringify(clients));
}

// Função para carregar logo e pré-visualizar
document
  .getElementById("logoInput")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        currentClientLogo = e.target.result;
        const logoPreview = document.getElementById("logoPreview");
        logoPreview.innerHTML = `<img src="${currentClientLogo}" alt="Logo Preview">`;
      };
      reader.readAsDataURL(file);
    } else {
      currentClientLogo = null;
      document.getElementById("logoPreview").innerHTML =
        '<span class="text-gray-400 text-sm">Sem logo</span>';
    }
  });

// Função para adicionar produto à lista temporária do formulário
function addProductToForm() {
  const productNameInput = document.getElementById("productName");
  const productValueInput = document.getElementById("productValue");

  const name = productNameInput.value.trim();
  const value = parseFloat(productValueInput.value);

  if (!name || isNaN(value) || value <= 0) {
    showMessage(
      "Por favor, insira um nome e um valor válido para o produto.",
      "error"
    );
    return;
  }

  currentClientProducts.push({ name, value });
  updateProductListDisplay();
  productNameInput.value = "";
  productValueInput.value = "";
}

// Função para atualizar a exibição da lista de produtos no formulário
function updateProductListDisplay() {
  const productListDiv = document.getElementById("productList");
  productListDiv.innerHTML = "";
  if (currentClientProducts.length === 0) {
    productListDiv.innerHTML =
      '<li class="text-gray-500 text-sm">Nenhum produto adicionado.</li>';
    return;
  }
  currentClientProducts.forEach((product, index) => {
    const li = document.createElement("li");
    li.className =
      "flex justify-between items-center py-1 border-b last:border-b-0";
    li.innerHTML = `
      <span>${product.name}: R$ ${product.value.toFixed(2)}</span>
      <button onclick="removeProductFromForm(${index})" class="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600">Remover</button>
    `;
    productListDiv.appendChild(li);
  });
}

// Função para remover produto da lista temporária do formulário
function removeProductFromForm(index) {
  currentClientProducts.splice(index, 1);
  updateProductListDisplay();
}

// Função para adicionar ou atualizar cliente
function addOrUpdateClient() {
  const name = document.getElementById("clientName").value.trim();
  const phone = document.getElementById("clientPhone").value.trim();
  const email = document.getElementById("clientEmail").value.trim();
  const address = document.getElementById("clientAddress").value.trim();

  if (!name) {
    showMessage("O nome do cliente é obrigatório.", "error");
    return;
  }

  const clientData = {
    id: editingClientId || Date.now(),
    name,
    phone,
    email,
    address,
    logo: currentClientLogo,
    products: [...currentClientProducts], // Copia para evitar referência
  };

  if (editingClientId) {
    // Atualiza cliente existente
    const index = clients.findIndex((c) => c.id === editingClientId);
    if (index !== -1) {
      clients[index] = clientData;
      showMessage("Cliente atualizado com sucesso!", "success");
    }
  } else {
    // Adiciona novo cliente
    clients.push(clientData);
    showMessage("Cliente adicionado com sucesso!", "success");
  }

  saveClients();
  renderClientList();
  clearClientForm();
}

// Função para limpar o formulário do cliente
function clearClientForm() {
  document.getElementById("clientId").value = "";
  document.getElementById("clientName").value = "";
  document.getElementById("clientPhone").value = "";
  document.getElementById("clientEmail").value = "";
  document.getElementById("clientAddress").value = "";
  document.getElementById("logoInput").value = ""; // Limpa o input de arquivo
  document.getElementById("logoPreview").innerHTML =
    '<span class="text-gray-400 text-sm">Sem logo</span>';

  currentClientProducts = [];
  currentClientLogo = null;
  editingClientId = null;

  updateProductListDisplay();
  document.getElementById("formTitle").textContent = "Adicionar Novo Cliente";
  document.getElementById("saveClientButton").textContent = "Adicionar Cliente";
  document.getElementById("cancelEditButton").classList.add("hidden");
}

// Função para renderizar a lista de clientes na tabela
function renderClientList() {
  const clientTableBody = document.getElementById("clientTableBody");
  clientTableBody.innerHTML = "";

  if (clients.length === 0) {
    clientTableBody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-gray-500">Nenhum cliente cadastrado.</td></tr>`;
    return;
  }

  clients.forEach((client) => {
    const row = document.createElement("tr");
    row.className = "hover:bg-gray-50";
    row.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${
        client.name
      }</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${
        client.phone || "-"
      }</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${
        client.email || "-"
      }</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button onclick="editClient(${
          client.id
        })" class="text-blue-600 hover:text-blue-900 mr-3">Editar</button>
        <button onclick="deleteClient(${
          client.id
        })" class="text-red-600 hover:text-red-900 mr-3">Excluir</button>
        <button onclick="generatePDF(${
          client.id
        })" class="text-green-600 hover:text-green-900">Gerar PDF</button>
      </td>
    `;
    clientTableBody.appendChild(row);
  });
}

// Função para editar um cliente
function editClient(id) {
  const client = clients.find((c) => c.id === id);
  if (client) {
    editingClientId = client.id;
    document.getElementById("formTitle").textContent = "Editar Cliente";
    document.getElementById("saveClientButton").textContent =
      "Salvar Alterações";
    document.getElementById("cancelEditButton").classList.remove("hidden");

    document.getElementById("clientId").value = client.id;
    document.getElementById("clientName").value = client.name;
    document.getElementById("clientPhone").value = client.phone;
    document.getElementById("clientEmail").value = client.email;
    document.getElementById("clientAddress").value = client.address;

    currentClientLogo = client.logo;
    const logoPreview = document.getElementById("logoPreview");
    if (client.logo) {
      logoPreview.innerHTML = `<img src="${client.logo}" alt="Logo Preview">`;
    } else {
      logoPreview.innerHTML =
        '<span class="text-gray-400 text-sm">Sem logo</span>';
    }

    currentClientProducts = [...client.products]; // Copia os produtos para edição
    updateProductListDisplay();

    // Rola para o topo do formulário para facilitar a edição
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// Função para excluir um cliente
function deleteClient(id) {
  if (confirm("Tem certeza que deseja excluir este cliente?")) {
    clients = clients.filter((client) => client.id !== id);
    saveClients();
    renderClientList();
    clearClientForm();
    showMessage("Cliente excluído com sucesso!", "success");
  }
}

// Função para gerar PDF
function generatePDF(clientId) {
  const client = clients.find((c) => c.id === clientId);
  if (!client) {
    showMessage("Cliente não encontrado para gerar PDF.", "error");
    return;
  }

  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    let currentY = 20; // Posição Y inicial para o topo da página
    const logoWidth = 50;
    const logoHeight = 50;
    const lineHeight = 8; // Espaçamento entre as linhas de texto

    // Centralizar logo
    const logoX = (pageWidth - logoWidth) / 2;
    if (client.logo) {
      try {
        doc.addImage(
          client.logo,
          "PNG",
          logoX,
          currentY,
          logoWidth,
          logoHeight
        );
      } catch (e) {
        console.error("Erro ao adicionar logo ao PDF:", e);
        // Não impede a geração do PDF, apenas registra o erro do logo
      }
    }
    currentY += logoHeight + 20; // Espaçamento após o logo

    // Início das informações do cliente em formato de colunas
    const labelX = 20; // Posição X para os rótulos
    const valueX = 70; // Posição X para os valores (ajuste conforme necessário para alinhar)

    doc.setFontSize(16);
    doc.text("Ficha do Cliente", pageWidth / 2, currentY, { align: "center" });
    currentY += 15; // Espaço após o título

    doc.setFontSize(12);

    // Informações do Cliente
    doc.text("Nome:", labelX, currentY);
    doc.text(`${client.name}`, valueX, currentY);
    currentY += lineHeight;

    doc.text("Telefone:", labelX, currentY);
    doc.text(`${client.phone || "-"}`, valueX, currentY);
    currentY += lineHeight;

    doc.text("E-mail:", labelX, currentY);
    doc.text(`${client.email || "-"}`, valueX, currentY);
    currentY += lineHeight;

    doc.text("Endereço:", labelX, currentY);
    doc.text(`${client.address || "-"}`, valueX, currentY);
    currentY += lineHeight + 5; // Espaço extra antes dos produtos

    // Produtos
    doc.text("Produtos:", labelX, currentY);
    currentY += lineHeight;

    let totalProductsValue = 0; // Inicializa o total
    if (client.products && client.products.length > 0) {
      client.products.forEach((product) => {
        doc.text(`  ${product.name}:`, labelX + 5, currentY); // Recuado
        doc.text(`R$ ${product.value.toFixed(2)}`, valueX, currentY);
        currentY += lineHeight;
        totalProductsValue += product.value; // Soma o valor do produto
      });
    } else {
      doc.setFontSize(10);
      doc.text(
        "Nenhum produto registrado para este cliente.",
        valueX,
        currentY
      );
      currentY += lineHeight;
    }

    // Exibir o total dos produtos
    doc.setFontSize(12);
    doc.text("Total dos Produtos:", labelX, currentY);
    doc.text(`R$ ${totalProductsValue.toFixed(2)}`, valueX, currentY);
    currentY += lineHeight + 10; // Espaço após o total

    // Informações da Empresa no rodapé
    doc.setFontSize(10);
    doc.text(
      `Gerado por: Sergio Luiz Soluções Inteligentes | Data: ${new Date().toLocaleDateString(
        "pt-BR"
      )}`,
      20,
      doc.internal.pageSize.height - 15
    );

    doc.save(`ficha_cliente_${client.name}.pdf`);
    showMessage("PDF gerado com sucesso!", "success");
  } catch (error) {
    console.error("Erro geral na geração do PDF:", error);
    showMessage(
      "Ocorreu um erro ao gerar o PDF. Verifique o console do navegador para mais detalhes.",
      "error"
    );
  }
}

// Inicializa a lista de clientes ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  renderClientList();
  updateProductListDisplay(); // Garante que a lista de produtos vazia seja exibida inicialmente
});
