const formClimatizador = document.getElementById('formClimatizador');
const listaClimatizadores = document.getElementById('listaClimatizadores');
const totalClimatizadores = document.getElementById('totalClimatizadores');
const climatizadoresTestados = document.getElementById('climatizadoresTestados');
const climatizadoresNaoTestados = document.getElementById('climatizadoresNaoTestados');
const mensagemCadastro = document.getElementById('mensagemCadastro');

// Variável global para armazenar o código do climatizador sendo editado
let codigoEmEdicao = null;

formClimatizador.addEventListener('submit', (e) => {
    e.preventDefault();

    const nomeClimatizador = document.getElementById('nomeClimatizador').value;
    const codigoClimatizador = document.getElementById('codigoClimatizador').value;
    const categoriaClimatizador = document.getElementById('categoriaClimatizador').value;
    const descricaoClimatizador = document.getElementById('descricaoClimatizador').value;

    const climatizador = {
        nome: nomeClimatizador,
        codigo: codigoClimatizador,
        categoria: categoriaClimatizador,
        descricao: descricaoClimatizador,
        testado: true, // Assumido como "testado" por padrão
    };

    if (codigoEmEdicao) {
        // Se estamos editando, enviaremos um PUT
        fetch(`http://localhost:3001/climatizadores/${codigoEmEdicao}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(climatizador),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mensagemCadastro.textContent = 'Climatizador Atualizado com Sucesso!';
                atualizarTabelaClimatizadores();
                atualizarTotaisEstoque();
                formClimatizador.reset();
                codigoEmEdicao = null; // Resetando o código em edição
            } else {
                mensagemCadastro.textContent = 'Erro ao atualizar climatizador.';
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            mensagemCadastro.textContent = 'Erro ao atualizar climatizador.';
        });
    } else {
        // Se não estamos editando, enviaremos um POST
        fetch('http://localhost:3001/climatizadores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(climatizador),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mensagemCadastro.textContent = 'Climatizador Cadastrado com Sucesso!';
                atualizarTabelaClimatizadores();
                atualizarTotaisEstoque();
                formClimatizador.reset();
            } else {
                mensagemCadastro.textContent = 'Erro ao cadastrar climatizador.';
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            mensagemCadastro.textContent = 'Erro ao cadastrar climatizador.';
        });
    }
});

function atualizarTabelaClimatizadores() {
    // Buscar os climatizadores do backend
    fetch('http://localhost:3001/climatizadores')
        .then(response => response.json())
        .then(data => {
            listaClimatizadores.innerHTML = '';
            data.forEach((climatizador) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${climatizador.nome}</td>
                    <td>${climatizador.codigo}</td>
                    <td>${climatizador.categoria}</td>
                    <td>${climatizador.descricao}</td>
                    <td>
                        <button class="editar" onclick="editarClimatizador('${climatizador.codigo}')">Editar</button>
                        <button class="excluir" onclick="excluirClimatizador('${climatizador.codigo}')">Excluir</button>
                    </td>
                `;
                listaClimatizadores.appendChild(row);
            });
        })
        .catch(error => console.error('Erro ao buscar climatizadores:', error));
}

function atualizarTotaisEstoque() {
    // Buscar os climatizadores do backend para atualizar os totais
    fetch('http://localhost:3001/climatizadores')
        .then(response => response.json())
        .then(data => {
            totalClimatizadores.textContent = data.length;
            const testados = data.filter(clim => clim.testado).length;
            const naoTestados = data.filter(clim => !clim.testado).length;
            climatizadoresTestados.textContent = testados;
            climatizadoresNaoTestados.textContent = naoTestados;
        })
        .catch(error => console.error('Erro ao buscar climatizadores para totais:', error));
}

function excluirClimatizador(codigo) {
    fetch(`http://localhost:3001/climatizadores/${codigo}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            atualizarTabelaClimatizadores();
            atualizarTotaisEstoque();
        } else {
            alert('Erro ao excluir climatizador');
        }
    })
    .catch(error => console.error('Erro:', error));
}

function editarClimatizador(codigo) {
    // Obter os dados do climatizador
    fetch(`http://localhost:3001/climatizadores/${codigo}`)
        .then(response => response.json())
        .then(data => {
            // Preencher o formulário com os dados do climatizador
            document.getElementById('nomeClimatizador').value = data.nome;
            document.getElementById('codigoClimatizador').value = data.codigo;
            document.getElementById('categoriaClimatizador').value = data.categoria;
            document.getElementById('descricaoClimatizador').value = data.descricao;
            
            // Definir o código do climatizador em edição
            codigoEmEdicao = codigo;
            mensagemCadastro.textContent = 'Editar Climatizador';

        })
        .catch(error => console.error('Erro ao buscar climatizador:', error));
}

