export function body(path: string) {
  return {
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: `#/components/schemas/${path}`,
          },
        },
      },
    },
  };
}
