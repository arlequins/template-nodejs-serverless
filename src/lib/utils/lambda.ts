export const wrapper = async (handler) => {
  try {
    const result = await handler();
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error("Error occurred:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal Server Error",
        error: error?.message,
      }),
    };
  }
};
