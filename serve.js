const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');  // Adicionado para permitir requisições CORS
const app = express();

const DATA_FILE = path.join(__dirname, 'climatizadores.json');

// Middleware para parsear JSON
app.use(express.json());

// Habilitar CORS para permitir requisições do frontend
app.use(cors());

// Função para ler os climatizadores do arquivo JSON
const lerClimatizadores = () => {
    try {
        if (!fs.existsSync(DATA_FILE)) return [];
        const data = fs.readFileSync(DATA_FILE);
        return JSON.parse(data);
    } catch (error) {
        console.error('Erro ao ler o arquivo JSON:', error);
        return [];
    }
};

// Função para salvar os climatizadores no arquivo JSON
const salvarClimatizadores = (dados) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(dados, null, 2));
    } catch (error) {
        console.error('Erro ao salvar o arquivo JSON:', error);
    }
};

// Servir os arquivos estáticos
app.use(express.static(path.join(__dirname)));

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para obter os climatizadores
app.get('/climatizadores', (req, res) => {
    const climatizadores = lerClimatizadores();
    res.json(climatizadores);
});

// Rota para adicionar um novo climatizador
app.post('/climatizadores', (req, res) => {
    const climatizadores = lerClimatizadores();
    const novoClimatizador = req.body;
    
    // Verificar se já existe um climatizador com o mesmo código
    if (climatizadores.some(c => c.codigo === novoClimatizador.codigo)) {
        return res.status(400).json({ message: 'Código já cadastrado.' });
    }
    
    climatizadores.push(novoClimatizador);
    salvarClimatizadores(climatizadores);
    res.status(201).json(novoClimatizador);
});

// Rota para editar um climatizador
app.put('/climatizadores/:codigo', (req, res) => {
    const { codigo } = req.params;
    const { modelo, notaFiscal, descricao, status } = req.body;
    let climatizadores = lerClimatizadores();
    
    const index = climatizadores.findIndex(c => c.codigo === codigo);
    if (index === -1) {
        return res.status(404).json({ message: 'Climatizador não encontrado.' });
    }
    
    climatizadores[index] = { ...climatizadores[index], modelo, notaFiscal, descricao, status };
    salvarClimatizadores(climatizadores);
    res.json(climatizadores[index]);
});

// Rota para excluir um climatizador
app.delete('/climatizadores/:codigo', (req, res) => {
    const { codigo } = req.params;
    let climatizadores = lerClimatizadores();
    
    const filtrados = climatizadores.filter(c => c.codigo !== codigo);
    if (filtrados.length === climatizadores.length) {
        return res.status(404).json({ message: 'Climatizador não encontrado.' });
    }
    
    salvarClimatizadores(filtrados);
    res.status(204).send();
});

// Rodar o servidor na porta 3001
const PORT = 3001;
app.listen(3001, '0.0.0.0', () => {
    console.log('Servidor rodando na porta 3001');
});
