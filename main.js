
document.getElementById('info').addEventListener('click', async () => {
    const { infoGDPR } = await import('./info.js');
    document.getElementById('kontti').innerHTML = infoGDPR();
});
