from flask import Flask, Response , jsonify
import pickle
from flask_cors import CORS
import cv2
import mediapipe as mp
import numpy as np
import json
app = Flask(__name__)
model_dict = pickle.load(open('./model.p', 'rb'))
model = model_dict['model']
CORS(app)
cap = cv2.VideoCapture(0)

mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

# hands = mp_hands.Hands(static_image_mode=True, min_detection_confidence=0.3)
hands = mp_hands.Hands(static_image_mode=False,
                       max_num_hands=2, min_detection_confidence=0.3)

labels_dict = {0: 'A', 1: 'B', 2: 'C', 3:'D' , 4:'E',5:'F' ,6:'G' , 7:'H' , 8: 'I' ,9:'K' , 10:'L' , 11:'M' ,12: 'N' ,13: 'O' , 14: 'P' ,15:'Q' ,16:'R' , 17: 'S' ,18: 'T' , 19:'U' ,20:'V' ,21: 'W' , 22:'X' , 23:'Y'  }


def gen_frames():
    while True:
            
        data_aux = []
        x_ = []
        y_ = []

        ret, frame = cap.read()

        H, W, _ = frame.shape

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        predicted_character = ""
        predicted_accuracy = 0.0
        results = hands.process(frame_rgb)
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                mp_drawing.draw_landmarks(
                    frame,  # image to draw
                    hand_landmarks,  # model output
                    mp_hands.HAND_CONNECTIONS,  # hand connections
                    mp_drawing_styles.get_default_hand_landmarks_style(),
                    mp_drawing_styles.get_default_hand_connections_style())

            for hand_landmarks in results.multi_hand_landmarks:
                data_aux = []
                x_ = []
                y_ = []
                for i in range(len(hand_landmarks.landmark)):
                    x = hand_landmarks.landmark[i].x
                    y = hand_landmarks.landmark[i].y

                    x_.append(x)
                    y_.append(y)

                for i in range(len(hand_landmarks.landmark)):
                    x = hand_landmarks.landmark[i].x
                    y = hand_landmarks.landmark[i].y
                    data_aux.append(x - min(x_))
                    data_aux.append(y - min(y_))

                x1 = int(min(x_) * W) - 10
                y1 = int(min(y_) * H) - 10

                x2 = int(max(x_) * W) - 10
                y2 = int(max(y_) * H) - 10

                prediction = model.predict([np.asarray(data_aux)])
                prediction_accuracy = model.predict_proba([np.asarray(data_aux)])
                predicted_character = labels_dict[int(prediction[0])]
                predicted_accuracy = max(prediction_accuracy[0])
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 0), 4)
                cv2.putText(frame, predicted_character, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 1.3, (0, 0, 0), 3,
                            cv2.LINE_AA)
                cv2.putText(frame, str(round( predicted_accuracy*100)), (x1+20, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 1.3, (0, 0, 0), 3,
                            cv2.LINE_AA)
                
                
                # data1 = predicted_accuracy
                # data2 = predicted_character
                # return jsonify(data1 , data2)
        

        # print(frame)
        # yield frame, predicted_character, predicted_accuracy    
        # ret, buffer = cv2.imencode('.jpg', frame)
        # frame = buffer.tobytes()
        # yield (b'--frame\r\n'
        #                 b'Content-Type: image/jpeg\r\n\r\n' + cv2.imencode('.jpg', frame)[1].tobytes() + b'\r\n' 
        #                 b'Content-Type: text/plain\r\n\r\n' + str(predicted_character).encode() + b'\r\n'
        #                 b'Content-Type: text/plain\r\n\r\n' + str(predicted_accuracy).encode() + b'\r\n')
        # yield (b'--frame\r\n'
        #     b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

        data = {
            'image': cv2.imencode('.jpg', frame)[1].tobytes().decode('latin-1'),
            'predicted_character': predicted_character,
            'predicted_accuracy': predicted_accuracy
        }
        event = 'data: ' + json.dumps(data) + '\n\n'
        yield event
        


@app.route('/video_feed')
def video_feed():
    # def generate():
    #     for frame, _, _ in gen_frames():
    #         frame_bytes = frame.astype('uint8').tobytes()
    #         yield (b'--frame\r\n'
    #                b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
   
    # return Response(generate(),
    #                 mimetype='multipart/x-mixed-replace; boundary=frame')
        return Response(gen_frames(),
                     mimetype='text/event-stream')
    

if __name__ == "__main__":
    app.run(debug=True)

