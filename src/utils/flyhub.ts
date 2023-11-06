import { ENV } from "@config";
import { getAuthorizeHeader } from "@utils/authorize";
import { joinUrl } from "@utils/joinUrl";
import axios, { AxiosError } from "axios";
import { NextFunction, Request, Response } from "express";

export async function gotToFlyHub(req: Request, res: Response, next: NextFunction) {
  try {
    const targetURL = new URL(joinUrl(ENV.FLY_HUB_API_BASE_URL, req.params[0]));

    for (const [key, value] of Object.entries(req.query)) {
      targetURL.searchParams.append(key, value.toString());
    }

    const token = await getAuthorizeHeader();

    const axiosResponse = await axios({
      method: req.method,
      url: targetURL.toString(),
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      data: req.body,
    });

    const { data, headers, status } = axiosResponse;

    res.status(status);

    for (const key in headers) {
      res.set(key, headers[key]);
    }

    res.send(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const errorMessage = axiosError.message;
      const status = axiosError.response ? axiosError.response.status : 500;
      const responseData = axiosError.response?.data;

      res.status(status);
      if (responseData) return res.send(responseData);
      res.send({ error: errorMessage });
    } else {
      next(error);
    }
  }
}
