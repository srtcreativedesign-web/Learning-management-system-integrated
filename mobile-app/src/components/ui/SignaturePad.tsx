import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface Point {
  x: number;
  y: number;
}

interface Path {
  points: Point[];
}

interface SignaturePadProps {
  label: string;
  signerName?: string;
  onSignatureChange: (hasSigned: boolean, signatureSummary: string) => void;
  onBeginDrawing?: () => void;
  onEndDrawing?: () => void;
  height?: number;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  label,
  signerName,
  onSignatureChange,
  onBeginDrawing,
  onEndDrawing,
  height = 120,
}) => {
  const [paths, setPaths] = useState<Path[]>([]);
  const pathsRef = useRef<Path[]>([]);
  const currentPathRef = useRef<Point[]>([]);

  const generateSvg = (allPaths: Path[]) => {
    let pathD = '';
    allPaths.forEach((p) => {
      p.points.forEach((pt, idx) => {
        if (idx === 0) {
          pathD += `M ${pt.x.toFixed(1)} ${pt.y.toFixed(1)} `;
        } else {
          pathD += `L ${pt.x.toFixed(1)} ${pt.y.toFixed(1)} `;
        }
      });
    });

    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 ${height}" width="320" height="${height}"><path d="${pathD.trim()}" fill="none" stroke="#0F172A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        onBeginDrawing?.();
        const { locationX, locationY } = evt.nativeEvent;
        currentPathRef.current = [{ x: locationX, y: locationY }];
        setPaths((prev) => {
          const next = [...prev, { points: [{ x: locationX, y: locationY }] }];
          pathsRef.current = next;
          return next;
        });
      },
      onPanResponderMove: (evt: GestureResponderEvent) => {
        const { locationX, locationY } = evt.nativeEvent;
        currentPathRef.current.push({ x: locationX, y: locationY });

        setPaths((prev) => {
          if (prev.length === 0) return prev;
          const next = [...prev];
          next[next.length - 1] = { points: [...currentPathRef.current] };
          pathsRef.current = next;
          return next;
        });
      },
      onPanResponderRelease: () => {
        onEndDrawing?.();
        if (pathsRef.current.length > 0) {
          const svgData = generateSvg(pathsRef.current);
          onSignatureChange(true, svgData);
        }
      },
      onPanResponderTerminate: () => {
        onEndDrawing?.();
      },
    })
  ).current;

  const handleClear = () => {
    pathsRef.current = [];
    currentPathRef.current = [];
    setPaths([]);
    onSignatureChange(false, '');
  };

  const hasSignature = paths.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>{label}</Text>
          {signerName ? (
            <Text style={styles.signerName}>{signerName}</Text>
          ) : null}
        </View>

        {hasSignature && (
          <TouchableOpacity
            onPress={handleClear}
            style={styles.clearButton}
            activeOpacity={0.7}
          >
            <MaterialIcons name="refresh" size={14} color="#EF4444" />
            <Text style={styles.clearText}>Ulangi</Text>
          </TouchableOpacity>
        )}
      </View>

      <View
        style={[styles.padArea, { height }]}
        {...panResponder.panHandlers}
      >
        {/* Placeholder guide line and text */}
        {!hasSignature && (
          <View style={styles.placeholderContainer} pointerEvents="none">
            <MaterialIcons name="draw" size={24} color="#CBD5E1" />
            <Text style={styles.placeholderText}>
              Goreskan tanda tangan digital di area ini
            </Text>
          </View>
        )}

        {/* Baseline indicator */}
        <View style={styles.baseline} pointerEvents="none" />

        {/* Render signature paths */}
        {paths.map((path, pIdx) => {
          return path.points.map((pt, ptIdx) => {
            if (ptIdx === 0) return null;
            const prevPt = path.points[ptIdx - 1];
            const dx = pt.x - prevPt.x;
            const dy = pt.y - prevPt.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);

            return (
              <View
                key={`${pIdx}-${ptIdx}`}
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  left: prevPt.x,
                  top: prevPt.y,
                  width: distance + 2,
                  height: 2.8,
                  backgroundColor: '#0F172A',
                  borderRadius: 1.5,
                  transform: [
                    { rotate: `${angle}deg` },
                    { translateX: distance / 2 },
                  ],
                }}
              />
            );
          });
        })}

        {hasSignature && (
          <View style={styles.signedBadge} pointerEvents="none">
            <MaterialIcons name="check-circle" size={13} color="#10B981" />
            <Text style={styles.signedBadgeText}>Tersimpan</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  signerName: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#FEF2F2',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 3,
  },
  clearText: {
    fontSize: 11,
    color: '#EF4444',
    fontWeight: '600',
  },
  padArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContainer: {
    alignItems: 'center',
    gap: 4,
  },
  placeholderText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  baseline: {
    position: 'absolute',
    bottom: 22,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  signedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: 3,
  },
  signedBadgeText: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '700',
  },
});
