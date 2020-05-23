from LilithPyBezier.LilithPyBezier import LPBezier
import time


def _get_time():
    timeStruct = time.localtime(time.time())
    strTime = time.strftime("%Y-%m-%d %H:%M:%S", timeStruct)
    return strTime


def write_json(data):
    import json
    d = dict()
    d['xs'] = list(data['xs'])
    d['ys'] = list(data['ys'])
    file_name = 'a_d1.json'
    with open(file_name, 'w') as f:
        f.write(json.dumps(d))


if __name__ == '__main__':
    newCanvas = LPBezier(6, 6) # which mean 6 * 100 px
    newCanvas.show()
    write_json(newCanvas.point['Bezier_points'])
