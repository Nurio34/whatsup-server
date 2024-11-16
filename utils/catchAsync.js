const catchAsync = (asyncFn) => {
    return (req, res, next) => {
        asyncFn(req, res, next).catch(next);
    };
};

module.exports = catchAsync;
