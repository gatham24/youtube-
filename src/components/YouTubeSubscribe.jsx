
import { useEffect, useRef, useState } from "react";

const CHANNEL_ID = "UC9ybIb8ZWZ6vQ4dnIuzIKMQ";
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPE = "https://www.googleapis.com/auth/youtube.force-ssl";

export default function YouTubeSubscribe() {
  const tokenClient = useRef(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("info");

  useEffect(() => {
    let cancelled = false;

    function initialize() {
      if (cancelled) return;

      if (!CLIENT_ID) {
        setStatus("Google Client ID is missing from .env.");
        setStatusType("error");
        return;
      }

      if (!window.google?.accounts?.oauth2) {
        setStatus("Google Sign-In failed to load. Refresh the page.");
        setStatusType("error");
        return;
      }

      tokenClient.current = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPE,
        callback: async (response) => {
          if (cancelled) return;

          if (response.error || !response.access_token) {
            setLoading(false);
            setStatus(response.error_description || response.error || "Google authorization failed.");
            setStatusType("error");
            return;
          }

          const headers = {
            Authorization: `Bearer ${response.access_token}`,
            "Content-Type": "application/json",
          };

          try {
            setStatus("Checking your YouTube account…");

            // Check whether the channel is already in this account's subscriptions.
            const checkResponse = await fetch(
              `https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&forChannelId=${CHANNEL_ID}&maxResults=1`,
              { headers }
            );

            const checkData = await checkResponse.json();

            if (!checkResponse.ok) {
              throw new Error(
                checkData.error?.message ||
                  `Subscription check failed (${checkResponse.status}).`
              );
            }

            if (checkData.items?.some(
              (item) => item.snippet?.resourceId?.channelId === CHANNEL_ID
            )) {
              setStatus("This YouTube account is already subscribed to your channel.");
              setStatusType("success");
              return;
            }

            setStatus("Adding your subscription…");

            const response = await fetch(
              "https://www.googleapis.com/youtube/v3/subscriptions?part=snippet",
              {
                method: "POST",
                headers,
                body: JSON.stringify({
                  snippet: {
                    resourceId: {
                      kind: "youtube#channel",
                      channelId: CHANNEL_ID,
                    },
                  },
                }),
              }
            );

            const data = await response.json();

            if (response.ok) {
              setStatus("Subscription created successfully!");
              setStatusType("success");
            } else if (
              data.error?.message?.toLowerCase().includes("already exists")
            ) {
              setStatus(
                "YouTube reports an existing subscription, but the subscription check did not find it. Verify that you're using the correct Google/YouTube account."
              );
              setStatusType("error");
            } else {
              throw new Error(
                data.error?.message || `Subscription failed (${response.status}).`
              );
            }
          } catch (error) {
            console.error("YouTube subscription error:", error);
            setStatus(error.message || "Something went wrong.");
            setStatusType("error");
          } finally {
            setLoading(false);
          }
        },
        error_callback: (error) => {
          setLoading(false);
          setStatus(error?.message || "Google authorization was cancelled or failed.");
          setStatusType("error");
        },
      });
    }

    const scriptId = "google-identity-services";
    let script = document.getElementById(scriptId);

    if (window.google?.accounts?.oauth2) {
      initialize();
    } else if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = initialize;
      script.onerror = () => {
        setStatus("Could not load Google Sign-In.");
        setStatusType("error");
      };
      document.head.appendChild(script);
    } else {
      script.addEventListener("load", initialize, { once: true });
    }

    return () => {
      cancelled = true;
    };
  }, []);

  function handleSubscribe() {
    if (!tokenClient.current) {
      setStatus("Google is still loading. Please try again.");
      setStatusType("error");
      return;
    }

    setLoading(true);
    setStatus("Opening Google authorization…");
    setStatusType("info");
    tokenClient.current.requestAccessToken();
  }

  return (
    <div className="subscribe-component">
      <button
        type="button"
        className="youtube-subscribe-button"
        onClick={handleSubscribe}
        disabled={loading}
      >
        {loading ? "Checking subscription…" : "▶ Subscribe on YouTube"}
      </button>

      {status && (
        <p className={`subscribe-status ${statusType}`} role="status" aria-live="polite">
          {status}
        </p>
      )}
    </div>
  );
}
