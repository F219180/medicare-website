exports.landingPage = async (req, res) => {
    res.sendFile(path.join(__dirname, '../theme/index.html'));
};