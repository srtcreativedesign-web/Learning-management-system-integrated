import React, { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SignaturePad } from '../ui/SignaturePad';
import { COLORS, GRADE_COLOR, RADIUS, TYPE } from '../../theme';
import { fetchInHouseChecklistsApi, submitInHouseSessionApi } from '../../services/api';

interface InHouseAssessmentBottomSheetProps {
  visible: boolean;
  outlet: {
    id: string;
    name: string;
    division?: string;
  } | null;
  trainerName?: string;
  onClose: () => void;
  onSuccess: (result: {
    outletId: string;
    score: number;
    grade: 'SB' | 'B' | 'C' | 'K';
    isPassed: boolean;
    status: string;
  }) => void;
}

export const InHouseAssessmentBottomSheet: React.FC<InHouseAssessmentBottomSheetProps> = ({
  visible,
  outlet,
  trainerName = 'Trainer TnD',
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<'checklist' | 'signature' | 'success'>('checklist');
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoadingChecklist, setIsLoadingChecklist] = useState(true);

  // Form states
  const [traineeName, setTraineeName] = useState('Tim Staf & Barista');
  const [formTrainerName, setFormTrainerName] = useState(trainerName);
  const [trainerNotes, setTrainerNotes] = useState('');
  const [scores, setScores] = useState<Record<string, number>>({});
  const [itemNotes, setItemNotes] = useState<Record<string, string>>({});

  // Signature & PIC states
  const [picName, setPicName] = useState('');
  const [trainerSigned, setTrainerSigned] = useState(false);
  const [trainerSignatureData, setTrainerSignatureData] = useState('');
  const [picSigned, setPicSigned] = useState(false);
  const [picSignatureData, setPicSignatureData] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScrollEnabled, setIsScrollEnabled] = useState(true);

  // Reset when opened
  useEffect(() => {
    if (visible && outlet) {
      setStep('checklist');
      setTrainerSigned(false);
      setTrainerSignatureData('');
      setPicSigned(false);
      setPicSignatureData('');
      setPicName('');
      setTrainerNotes('');
      setItemNotes({});

      setIsLoadingChecklist(true);
      fetchInHouseChecklistsApi().then((data) => {
        setCategories(data || []);
        const defaultScores: Record<string, number> = {};
        (data || []).forEach((cat: any) => {
          cat.checklists?.forEach((point: any) => {
            defaultScores[point.id] = 4; // Default 'B' (4)
          });
        });
        setScores(defaultScores);
        setIsLoadingChecklist(false);
      });
    }
  }, [visible, outlet]);

  // Live Score Calculation
  const summary = useMemo(() => {
    let totalScore = 0;
    let maxScore = 0;

    categories.forEach((cat) => {
      cat.checklists?.forEach((point: any) => {
        const score = scores[point.id] || 4;
        const max = point.max_score || 5;
        totalScore += score;
        maxScore += max;
      });
    });

    const percentage = maxScore > 0 ? parseFloat(((totalScore / maxScore) * 100).toFixed(1)) : 0;
    let grade: 'SB' | 'B' | 'C' | 'K' = 'K';
    if (percentage >= 85) grade = 'SB';
    else if (percentage >= 70) grade = 'B';
    else if (percentage >= 55) grade = 'C';

    const isPassed = percentage >= 70;

    return { totalScore, maxScore, percentage, grade, isPassed };
  }, [categories, scores]);

  const handleScoreSelect = (pointId: string, val: number) => {
    setScores((prev) => ({
      ...prev,
      [pointId]: val,
    }));
  };

  const handleProceedToSignature = () => {
    if (!traineeName.trim()) {
      Alert.alert('Perhatian', 'Mohon isi nama peserta atau tim yang dievaluasi.');
      return;
    }
    setStep('signature');
  };

  const handleSubmitFinal = async () => {
    if (!picName.trim()) {
      Alert.alert('Perhatian', 'Mohon isi nama PIC / Supervisor Outlet yang bertanggung jawab.');
      return;
    }

    if (!trainerSigned) {
      Alert.alert('Tanda Tangan Diperlukan', 'Trainer wajib membubuhkan tanda tangan digital.');
      return;
    }

    if (!picSigned) {
      Alert.alert('Tanda Tangan Diperlukan', 'PIC Outlet wajib membubuhkan tanda tangan digital sebagai persetujuan.');
      return;
    }

    setIsSubmitting(true);
    try {
      const assessmentsPayload = Object.keys(scores).map((pointId) => ({
        checklist_point_id: pointId,
        score: scores[pointId],
        notes: itemNotes[pointId] || '',
      }));

      const res = await submitInHouseSessionApi({
        trainer_name: formTrainerName,
        outlet_id: outlet?.id,
        trainee_name: traineeName,
        training_date: new Date().toISOString(),
        notes: trainerNotes,
        pic_name: picName,
        trainer_signature: trainerSignatureData,
        pic_signature: picSignatureData,
        assessments: assessmentsPayload,
      });

      setIsSubmitting(false);
      setStep('success');

      // Notify parent to update UI
      onSuccess({
        outletId: outlet?.id || '1',
        score: Math.round(summary.percentage),
        grade: summary.grade,
        isPassed: summary.isPassed,
        status: summary.isPassed ? 'Lulus Sesi' : 'Perlu Re-Training',
      });
    } catch (err: any) {
      setIsSubmitting(false);
      Alert.alert('Gagal', 'Terjadi kendala saat mengirim data evaluasi.');
    }
  };

  if (!visible || !outlet) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <View style={styles.sheetContainer}>
          {/* Top Notch / Handle */}
          <View style={styles.handleContainer}>
            <View style={styles.handleBar} />
          </View>

          {/* Header: outlet + live score, on brand */}
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.outletTitle} numberOfLines={1}>
                  {outlet.name}
                </Text>
                <Text style={styles.headerSubtitle}>
                  {step === 'checklist'
                    ? 'Lembar penilaian on-site'
                    : step === 'signature'
                    ? 'Pengesahan PIC & tanda tangan'
                    : 'Evaluasi selesai'}
                </Text>
              </View>

              <TouchableOpacity
                onPress={onClose}
                accessibilityLabel="Tutup lembar penilaian"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <MaterialIcons name="close" size={20} color={COLORS.onBrand} />
              </TouchableOpacity>
            </View>

            {step === 'checklist' && (
              <View style={styles.scoreStrip}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.scoreStripLabel}>NILAI BERJALAN</Text>
                  <Text style={styles.scoreStripValue}>
                    {summary.totalScore}
                    <Text style={{ fontSize: 15, color: COLORS.onBrandMuted, fontWeight: '600' }}>
                      {' '}/ {summary.maxScore}
                    </Text>
                  </Text>
                </View>

                <View style={{ alignItems: 'center' }}>
                  <Text style={styles.scoreStripLabel}>PERSENTASE</Text>
                  <Text style={styles.scoreStripValue}>{summary.percentage}%</Text>
                </View>

                <View
                  style={[
                    styles.gradeChip,
                    { backgroundColor: GRADE_COLOR[summary.grade] || COLORS.textMuted },
                  ]}
                >
                  <Text style={styles.gradeChipText}>{summary.grade}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Step 1: Checklist Penilaian */}
          {step === 'checklist' && (
            <View style={{ flex: 1 }}>
              {/* Scrollable Checklist */}
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
              >
                {/* Meta Inputs */}
                <View style={styles.metaBox}>
                  <View style={{ marginBottom: 10 }}>
                    <Text style={styles.inputLabel}>Peserta / Tim yang Dinilai</Text>
                    <TextInput
                      value={traineeName}
                      onChangeText={setTraineeName}
                      placeholder="Nama Staf / Tim Barista"
                      placeholderTextColor="#94A3B8"
                      style={styles.textInput}
                    />
                  </View>

                  <View>
                    <Text style={styles.inputLabel}>Trainer Penilai</Text>
                    <TextInput
                      value={formTrainerName}
                      onChangeText={setFormTrainerName}
                      placeholder="Nama Trainer TnD"
                      placeholderTextColor="#94A3B8"
                      style={styles.textInput}
                    />
                  </View>
                </View>

                {/* Rubrik Legend */}
                <View style={styles.legendContainer}>
                  <Text style={styles.legendTitle}>Skala Penilaian:</Text>
                  <View style={styles.legendRow}>
                    <Text style={[styles.legendPill, { backgroundColor: '#ECFDF5', color: '#065F46' }]}>SB: 5 (Sangat Baik)</Text>
                    <Text style={[styles.legendPill, { backgroundColor: '#E0F2FE', color: '#0369A1' }]}>B: 4 (Baik/Standar)</Text>
                    <Text style={[styles.legendPill, { backgroundColor: '#FEF3C7', color: '#92400E' }]}>C: 3 (Cukup)</Text>
                    <Text style={[styles.legendPill, { backgroundColor: '#FEE2E2', color: '#991B1B' }]}>K: 1 (Kurang)</Text>
                  </View>
                </View>

                {isLoadingChecklist ? (
                  <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                    <ActivityIndicator size="small" color="#419CC3" />
                    <Text style={{ fontSize: 12, color: '#64748B', marginTop: 8 }}>Memuat butir checklist standar...</Text>
                  </View>
                ) : (
                  categories.map((cat, cIdx) => (
                    <View key={cat.id || cIdx} style={styles.categoryCard}>
                      <View style={styles.categoryHeader}>
                        <View style={styles.categoryBadge}>
                          <Text style={styles.categoryBadgeText}>{cIdx + 1}</Text>
                        </View>
                        <Text style={styles.categoryTitle}>{cat.name}</Text>
                      </View>

                      <View style={{ padding: 12, gap: 12 }}>
                        {cat.checklists?.map((point: any, pIdx: number) => {
                          const currentVal = scores[point.id] || 4;

                          return (
                            <View key={point.id || pIdx} style={styles.pointItem}>
                              <Text style={styles.pointQuestion}>
                                {pIdx + 1}. {point.question}
                              </Text>
                              {point.description ? (
                                <Text style={styles.pointDesc}>{point.description}</Text>
                              ) : null}

                              {/* Button Options */}
                              <View style={styles.optionsRow}>
                                {[
                                  { label: 'SB (5)', val: 5, color: '#059669' },
                                  { label: 'B (4)', val: 4, color: '#0284C7' },
                                  { label: 'C (3)', val: 3, color: '#D97706' },
                                  { label: 'K (1)', val: 1, color: '#DC2626' },
                                ].map((opt) => {
                                  const isSelected = currentVal === opt.val;
                                  return (
                                    <TouchableOpacity
                                      key={opt.val}
                                      onPress={() => handleScoreSelect(point.id, opt.val)}
                                      activeOpacity={0.7}
                                      accessibilityState={{ selected: isSelected }}
                                      style={[
                                        styles.optionButton,
                                        { backgroundColor: `${opt.color}12`, borderColor: `${opt.color}40` },
                                        isSelected && {
                                          backgroundColor: opt.color,
                                          borderColor: opt.color,
                                        },
                                      ]}
                                    >
                                      <Text
                                        style={[
                                          styles.optionText,
                                          { color: opt.color },
                                          isSelected && { color: '#FFFFFF', fontWeight: '800' },
                                        ]}
                                      >
                                        {opt.label}
                                      </Text>
                                    </TouchableOpacity>
                                  );
                                })}
                              </View>

                              {/* Optional Point Note */}
                              <View style={styles.pointNoteRow}>
                                <MaterialIcons name="edit-note" size={16} color="#94A3B8" />
                                <TextInput
                                  value={itemNotes[point.id] || ''}
                                  onChangeText={(txt) =>
                                    setItemNotes((prev) => ({ ...prev, [point.id]: txt }))
                                  }
                                  placeholder="Catatan observasi butir ini (opsional)..."
                                  placeholderTextColor="#94A3B8"
                                  style={styles.pointNoteInput}
                                />
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  ))
                )}

                {/* Overall Trainer Notes */}
                <View style={{ marginTop: 8 }}>
                  <Text style={styles.inputLabel}>Catatan & Rekomendasi Keseluruhan Trainer</Text>
                  <TextInput
                    value={trainerNotes}
                    onChangeText={setTrainerNotes}
                    placeholder="Tuliskan catatan performa umum tim, kelebihan, atau aspek yang perlu ditingkatkan..."
                    placeholderTextColor="#94A3B8"
                    multiline
                    numberOfLines={3}
                    style={[styles.textInput, { height: 75, textAlignVertical: 'top' }]}
                  />
                </View>
              </ScrollView>

              {/* Bottom Next Button */}
              <View style={styles.footerContainer}>
                <TouchableOpacity
                  onPress={handleProceedToSignature}
                  style={styles.primaryButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryButtonText}>Lanjut ke Pengesahan & TTD</Text>
                  <MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Step 2: Signature & PIC Confirmation */}
          {step === 'signature' && (
            <View style={{ flex: 1 }}>
              <ScrollView
                style={{ flex: 1 }}
                scrollEnabled={isScrollEnabled}
                contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 14 }}
                showsVerticalScrollIndicator={false}
              >
                {/* Result Preview Box */}
                <View style={styles.resultPreviewBox}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                      <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600' }}>Hasil Penilaian On-Site</Text>
                      <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>
                        {summary.totalScore} / {summary.maxScore} Poin ({summary.percentage}%)
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.statusTag,
                        {
                          backgroundColor: summary.isPassed ? '#ECFDF5' : '#FEF2F2',
                          borderColor: summary.isPassed ? '#A7F3D0' : '#FECACA',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusTagText,
                          { color: summary.isPassed ? '#059669' : '#DC2626' },
                        ]}
                      >
                        Grade {summary.grade} • {summary.isPassed ? 'LULUS SESI' : 'RETRAINING'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* PIC Name Input */}
                <View style={{ marginVertical: 12 }}>
                  <Text style={styles.inputLabel}>
                    Nama PIC / Supervisor Outlet <Text style={{ color: '#EF4444' }}>*</Text>
                  </Text>
                  <TextInput
                    value={picName}
                    onChangeText={setPicName}
                    placeholder="Contoh: Bpk. Hendra (Store Manager)"
                    placeholderTextColor="#94A3B8"
                    style={[styles.textInput, { borderColor: picName ? '#419CC3' : '#E2E8F0' }]}
                  />
                  <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 3 }}>
                    PIC yang mendampingi dan memvalidasi sesi training hari ini.
                  </Text>
                </View>

                {/* Digital Signatures */}
                <SignaturePad
                  label="1. Tanda Tangan Trainer TnD"
                  signerName={formTrainerName}
                  onBeginDrawing={() => setIsScrollEnabled(false)}
                  onEndDrawing={() => setIsScrollEnabled(true)}
                  onSignatureChange={(hasSigned, sigData) => {
                    setTrainerSigned(hasSigned);
                    setTrainerSignatureData(sigData || '');
                  }}
                />

                <SignaturePad
                  label="2. Tanda Tangan PIC Outlet"
                  signerName={picName || 'PIC Outlet Terkait'}
                  onBeginDrawing={() => setIsScrollEnabled(false)}
                  onEndDrawing={() => setIsScrollEnabled(true)}
                  onSignatureChange={(hasSigned, sigData) => {
                    setPicSigned(hasSigned);
                    setPicSignatureData(sigData || '');
                  }}
                />

                <View style={styles.legalDisclaimer}>
                  <MaterialIcons name="verified-user" size={16} color="#419CC3" />
                  <Text style={styles.legalDisclaimerText}>
                    Dengan menekan tombol selesai, Trainer dan PIC Outlet menyatakan bahwa data penilaian di atas adalah sah dan benar.
                  </Text>
                </View>
              </ScrollView>

              {/* Action Buttons */}
              <View style={styles.footerContainerDual}>
                <TouchableOpacity
                  onPress={() => setStep('checklist')}
                  style={styles.secondaryButton}
                  activeOpacity={0.7}
                  disabled={isSubmitting}
                >
                  <MaterialIcons name="arrow-back" size={16} color="#64748B" />
                  <Text style={styles.secondaryButtonText}>Kembali</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSubmitFinal}
                  style={[
                    styles.primaryButton,
                    { flex: 2 },
                    (!picName || !trainerSigned || !picSigned || isSubmitting) && {
                      opacity: 0.6,
                    },
                  ]}
                  activeOpacity={0.8}
                  disabled={!picName || !trainerSigned || !picSigned || isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <MaterialIcons name="check-circle" size={18} color="#FFFFFF" />
                      <Text style={styles.primaryButtonText}>Selesaikan & Simpan</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Step 3: Success Confirmation */}
          {step === 'success' && (
            <View style={styles.successContainer}>
              <View style={styles.successIconCircle}>
                <MaterialIcons name="check" size={38} color="#FFFFFF" />
              </View>

              <Text style={styles.successTitle}>Penilaian Selesai!</Text>
              <Text style={styles.successDesc}>
                Hasil evaluasi on-site training untuk <Text style={{ fontWeight: '700', color: '#0F172A' }}>{outlet.name}</Text> telah berhasil disimpan dan disahkan oleh PIC ({picName}).
              </Text>

              <View style={styles.successSummaryBox}>
                <Text style={{ fontSize: 12, color: '#64748B' }}>Predikat Kelulusan:</Text>
                <Text style={{ fontSize: 22, fontWeight: '900', color: summary.isPassed ? '#059669' : '#DC2626', marginVertical: 2 }}>
                  Grade {summary.grade} ({summary.percentage}%)
                </Text>
                <Text style={{ fontSize: 12, fontWeight: '700', color: summary.isPassed ? '#059669' : '#DC2626' }}>
                  {summary.isPassed ? 'LULUS STANDAR ON-SITE' : 'PERLU SESI RETRAINING'}
                </Text>
              </View>

              <TouchableOpacity
                onPress={onClose}
                style={[styles.primaryButton, { width: '100%', marginTop: 20 }]}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>Tutup & Kembali ke Daftar Outlet</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    height: SCREEN_HEIGHT * 0.92,
    overflow: 'hidden',
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: COLORS.brandDeep,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: 2,
  },
  header: {
    backgroundColor: COLORS.brandDeep,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  outletTitle: {
    ...TYPE.h2,
    color: COLORS.onBrand,
  },
  headerSubtitle: {
    fontSize: 12.5,
    color: COLORS.onBrandMuted,
    marginTop: 3,
  },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  scoreStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  scoreStripLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: COLORS.onBrandMuted,
  },
  scoreStripValue: {
    fontSize: 21,
    fontWeight: '800',
    color: COLORS.onBrand,
    letterSpacing: -0.5,
    marginTop: 3,
  },
  gradeChip: {
    minWidth: 52,
    height: 44,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  gradeChipText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  metaBox: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: RADIUS.lg,
    marginVertical: 14,
    shadowColor: '#0B1C30',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 3,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '600',
  },
  legendContainer: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  legendTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  legendPill: {
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  categoryBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#419CC3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
  },
  pointItem: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  pointQuestion: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  pointDesc: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 14,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  optionButton: {
    flex: 1,
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  pointNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 4,
  },
  pointNoteInput: {
    flex: 1,
    minHeight: 40,
    fontSize: 12,
    color: '#334155',
    padding: 0,
  },
  footerContainer: {
    padding: 16,
    paddingBottom: 22,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  footerContainerDual: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    paddingBottom: 22,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  primaryButton: {
    backgroundColor: COLORS.brandDeep,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    borderRadius: 12,
    gap: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  secondaryButtonText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '700',
  },
  resultPreviewBox: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusTagText: {
    fontSize: 11,
    fontWeight: '800',
  },
  legalDisclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0F9FF',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginTop: 10,
  },
  legalDisclaimerText: {
    flex: 1,
    fontSize: 10,
    color: '#0369A1',
    lineHeight: 14,
  },
  successContainer: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#10B981',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
  },
  successDesc: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  successSummaryBox: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
});
