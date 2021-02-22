import fetch from 'node-fetch';

async function blinkLightById(id, withGreenColor) {
  const url = `http://192.168.178.27/api/wXiyQyCXoesbKstc7ob6M50UINFNv3houiEZ0Tgk/lights/${id}/state`;

  if (withGreenColor) {
    await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ on: false }),
    });

    await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        on: true,
        bri: 254,
        hue: 27274,
        sat: 218,
        xy: [0.2028, 0.6149],
        ct: 153,
        alert: 'lselect',
      }),
    });
  } else {
    await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ on: false }),
    });

    await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ on: true, bri: 254, alert: 'lselect' }),
    });
  }
}

export async function blinkLights() {
  return Promise.all[
    (blinkLightById(1, false),
    blinkLightById(2, false),
    blinkLightById(4, false),
    blinkLightById(5, true))
  ];
}
