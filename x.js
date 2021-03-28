// POST /api/returns {customerId, movieId}

// return 401 if user is not logged in
// return 400 if customerId is not provided
// return 400 if movieId is not provided
// return 404 if no rental found for this customer/movie
// return 400 if rental is processed already

// return 200 if valid request
// Set the return date
// calculate the rental fee
// Increase the stock
// Return the rental