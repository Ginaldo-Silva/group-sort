fetch('data.json')
    .then(response => response.json())
    .then(data => {
    const cursosUnicos = [...new Set(data.map(aluno => aluno.curso))];
    const cursoSelect = document.getElementById('cursoSelect');
    const turmaSelect = document.getElementById('turmaSelect');
    const quantidadeGruposInput = document.getElementById('quantidadeGrupos');
    const sortearGruposBtn = document.getElementById('sortearGrupos');
    const gruposContainer = document.getElementById('grupos-container');

    cursosUnicos.forEach(curso => {
        const option = document.createElement('option');
        option.value = curso;
        option.textContent = curso;
        cursoSelect.appendChild(option);
    });

    // Função para atualizar a lista de turmas com base no curso selecionado
    function atualizarTurmasPorCurso() {
        const cursoSelecionado = cursoSelect.value;
        const turmasUnicas = [...new Set(data.filter(aluno => aluno.curso === cursoSelecionado).map(aluno => aluno.turma))];

        // Limpar o select de turmas antes de adicionar as novas opções
        turmaSelect.innerHTML = '';

        turmasUnicas.forEach(turma => {
        const option = document.createElement('option');
        option.value = turma;
        option.textContent = turma;
        turmaSelect.appendChild(option);
        });

        // Chamar a função para atualizar a lista de alunos com base no curso e turma selecionados
        atualizarListaPorCursoETurma();
    }

    // Função para atualizar a lista de alunos com base no curso e turma selecionados
    function atualizarListaPorCursoETurma() {
        const cursoSelecionado = cursoSelect.value;
        const turmaSelecionada = turmaSelect.value;
        const listaAlunos = document.getElementById('lista-alunos');

        // Limpar a lista antes de adicionar os novos itens
        listaAlunos.innerHTML = '';

        // Filtrar alunos com base no curso e turma selecionados
        const alunosFiltrados = data.filter(aluno => aluno.curso === cursoSelecionado && aluno.turma === turmaSelecionada);

        alunosFiltrados.forEach(aluno => {
        const listItem = document.createElement('li');
        listItem.textContent = `${aluno.nome}`;
        listaAlunos.appendChild(listItem);
        });
    }

    // Função para sortear os grupos
    function sortearGrupos() {
        const quantidadeGrupos = parseInt(quantidadeGruposInput.value, 10);
        const cursoSelecionado = cursoSelect.value;
        const turmaSelecionada = turmaSelect.value;
        const participantes = data.filter(aluno => aluno.curso === cursoSelecionado && aluno.turma === turmaSelecionada);
        
        // Embaralhar os participantes aleatoriamente
        participantes.sort(() => Math.random() - 0.5);
        
        // Calcular o número de participantes em cada grupo
        const participantesPorGrupo = Math.floor(participantes.length / quantidadeGrupos);
        const participantesRestantes = participantes.length % quantidadeGrupos;
        
        // Limpar a lista antes de adicionar os novos itens
        gruposContainer.innerHTML = '';
        
        // Criar listas para cada grupo
        let inicio = 0;
        for (let i = 0; i < quantidadeGrupos; i++) {
            let fim = inicio + participantesPorGrupo + (i < participantesRestantes ? 1 : 0);
        
            // Criar div para cada grupo
            const grupoDiv = document.createElement('div');
            grupoDiv.classList.add('grupo');
        
            // Mostrar os participantes de cada grupo
            const grupoTitle = document.createElement('h2');
            grupoTitle.textContent = `Grupo ${i + 1}`;
            grupoDiv.appendChild(grupoTitle);
        
            const grupoList = document.createElement('ul');
            const grupo = participantes.slice(inicio, fim);
            grupo.forEach(aluno => {
            const listItem = document.createElement('li');
            listItem.textContent = aluno.nome;
            grupoList.appendChild(listItem);
            });
        
            grupoDiv.appendChild(grupoList);
        
            // Adicionar a div do grupo ao contêiner
            gruposContainer.appendChild(grupoDiv);
        
            inicio = fim;
        }
    }

    // Adicionar ouvintes de eventos para detectar mudanças nos selects e clique no botão de sorteio
    cursoSelect.addEventListener('change', atualizarTurmasPorCurso);
    turmaSelect.addEventListener('change', atualizarListaPorCursoETurma);
    sortearGruposBtn.addEventListener('click', sortearGrupos);

    // Chamar a função inicialmente para exibir a lista completa
    atualizarTurmasPorCurso();
})
.catch(error => console.error('Erro ao carregar o arquivo JSON:', error));