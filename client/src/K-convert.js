const Kconvert = {
  convertTo(amount) {
    if (!amount || isNaN(amount)) return '0';
    return `${(amount / 1000).toFixed(0)}k`;
  }
};

export default Kconvert;
