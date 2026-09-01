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
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { SignaturePad } from '../ui/SignaturePad';
import { COLORS, RADIUS, TYPE, SHADOW } from '../../theme';
import { fetchAuditChecklistsApi, submitAuditInspectionApi } from '../../services/api';

interface AuditInspectionBottomSheetProps {
  visible: boolean;
  outlet: {
    id: string;
    name: string;
    division?: string;
  } | null;
  auditorName?: string;
  onClose: () => void;
  onSuccess: (result: {
    outletId: string;
    score: number;
    isCompliant: boolean;
    status: string;
    okCount: number;
    nokCount: number;
  }) => void;
}

export const AuditInspectionBottomSheet: React.FC<AuditInspectionBottomSheetProps> = ({
  visible,
  outlet,
  auditorName = 'Auditor Lapangan',
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<'checklist' | 'signature' | 'success'>('checklist');
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoadingChecklist, setIsLoadingChecklist] = useState(true);

  // Form states
  const [formAuditorName, setFormAuditorName] = useState(auditorName);
  const [complianceStates, setComplianceStates] = useState<Record<string, boolean>>({}); // true = OK, false = NOK
  const [findingNotes, setFindingNotes] = useState<Record<string, string>>({});
  const [findingPhotos, setFindingPhotos] = useState<Record<string, string>>({}); // pointId -> imageUri
  const [generalNotes, setGeneralNotes] = useState('');

  // Signature & PIC states
  const [picName, setPicName] = useState('');
  const [auditorSigned, setAuditorSigned] = useState(false);
  const [auditorSignatureData, setAuditorSignatureData] = useState('');
  const [picSigned, setPicSigned] = useState(false);
  const [picSignatureData, setPicSignatureData] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScrollEnabled, setIsScrollEnabled] = useState(true);

  // Reset when opened
  useEffect(() => {
    if (visible && outlet) {
      setStep('checklist');
      setAuditorSigned(false);
      setAuditorSignatureData('');
      setPicSigned(false);
      setPicSignatureData('');
      setPicName('');
      setGeneralNotes('');
      setFindingNotes({});
      setFindingPhotos({});

      setIsLoadingChecklist(true);
      fetchAuditChecklistsApi().then((data) => {
        setCategories(data || []);
        const defaultCompliance: Record<string, boolean> = {};
        (data || []).forEach((cat: any) => {
          cat.checklists?.forEach((point: any) => {
            defaultCompliance[point.id] = true; // Default to OK
          });
        });
        setComplianceStates(defaultCompliance);
        setIsLoadingChecklist(false);
      });
    }
  }, [visible, outlet]);

  // Live Score Calculation
  const summary = useMemo(() => {
    let totalItems = 0;
    let okCount = 0;
    let nokCount = 0;

    categories.forEach((cat) => {
      cat.checklists?.forEach((point: any) => {
        totalItems += 1;
        if (complianceStates[point.id] === false) {
          nokCount += 1;
        } else {
          okCount += 1;
        }
      });
    });

    const percentage = totalItems > 0 ? Math.round((okCount / totalItems) * 100) : 100;
    const isCompliant = percentage >= 85 && nokCount <= 2;

    return {
      totalItems,
      okCount,
      nokCount,
      percentage,
      isCompliant,
    };
  }, [categories, complianceStates]);

  const togglePointCompliance = (pointId: string, isOk: boolean) => {
    setComplianceStates((prev) => ({
      ...prev,
      [pointId]: isOk,
    }));
  };

  // Camera & Photo Capture for Findings
  const handleCapturePhoto = async (pointId: string) => {
    Alert.alert(
      'Lampirkan Foto Temuan',
      'Pilih metode pengambilan foto bukti temuan lapangan:',
      [
        {
          text: 'Ambil Foto Kamera',
          onPress: async () => {
            try {
              const { status } = await ImagePicker.requestCameraPermissionsAsync();
              if (status !== 'granted') {
                Alert.alert('Izin Ditolak', 'Aplikasi memerlukan izin kamera untuk mengambil foto bukti temuan.');
                return;
              }

              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.7,
              });

              if (!result.canceled && result.assets && result.assets[0]) {
                setFindingPhotos((prev) => ({
                  ...prev,
                  [pointId]: result.assets[0].uri,
                }));
              }
            } catch (err) {
              console.warn('Camera capture error:', err);
              Alert.alert('Gagal Mengambil Foto', 'Terjadi kendala saat membuka kamera.');
            }
          },
        },
        {
          text: 'Pilih dari Galeri',
          onPress: async () => {
            try {
              const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (status !== 'granted') {
                Alert.alert('Izin Ditolak', 'Aplikasi memerlukan izin galeri untuk memilih foto.');
                return;
              }

              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.7,
              });

              if (!result.canceled && result.assets && result.assets[0]) {
                setFindingPhotos((prev) => ({
                  ...prev,
                  [pointId]: result.assets[0].uri,
                }));
              }
            } catch (err) {
              console.warn('Gallery pick error:', err);
              Alert.alert('Gagal Memilih Foto', 'Terjadi kendala saat membuka galeri.');
            }
          },
        },
        { text: 'Batal', style: 'cancel' },
      ]
    );
  };

  const handleRemovePhoto = (pointId: string) => {
    setFindingPhotos((prev) => {
      const updated = { ...prev };
      delete updated[pointId];
      return updated;
    });
  };

  const handleProceedToSignature = () => {
    setStep('signature');
  };

  const handleSubmitAudit = async () => {
    if (!picName.trim()) {
      Alert.alert('Data Belum Lengkap', 'Silakan masukkan nama PIC / Store Manager outlet.');
      return;
    }
    if (!auditorSigned) {
      Alert.alert('Tanda Tangan Diperlukan', 'Auditor wajib menandatangani lembar inspeksi.');
      return;
    }
    if (!picSigned) {
      Alert.alert('Tanda Tangan Diperlukan', 'PIC / Store Manager wajib menandatangani verifikasi inspeksi.');
      return;
    }

    setIsSubmitting(true);
    try {
      const findingsList: any[] = [];
      categories.forEach((cat) => {
        cat.checklists?.forEach((point: any) => {
          const isOk = complianceStates[point.id] !== false;
          findingsList.push({
            checklist_point_id: point.id,
            point_text: point.question,
            is_compliant: isOk,
            notes: !isOk ? findingNotes[point.id] || 'Temuan ketidaksesuaian' : undefined,
            photo_path: !isOk ? findingPhotos[point.id] : undefined,
          });
        });
      });

      await submitAuditInspectionApi({
        outlet_id: outlet?.id,
        outlet_name: outlet?.name || 'Outlet Cabang',
        auditor_name: formAuditorName || auditorName,
        pic_name: picName,
        notes: generalNotes,
        auditor_signature: auditorSignatureData,
        pic_signature: picSignatureData,
        compliance_score: summary.percentage,
        is_compliant: summary.isCompliant,
        total_items: summary.totalItems,
        ok_items: summary.okCount,
        nok_items: summary.nokCount,
        findings: findingsList,
      });

      setIsSubmitting(false);
      setStep('success');
    } catch (e: any) {
      setIsSubmitting(false);
      Alert.alert('Gagal Menyimpan', 'Terjadi kesalahan saat menyimpan data audit.');
    }
  };

  const handleFinish = () => {
    if (outlet) {
      onSuccess({
        outletId: outlet.id,
        score: summary.percentage,
        isCompliant: summary.isCompliant,
        status: summary.isCompliant ? 'Compliant' : 'Non-Compliant',
        okCount: summary.okCount,
        nokCount: summary.nokCount,
      });
    }
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetContainer}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <MaterialIcons name="fact-check" size={18} color={COLORS.primary} />
                <Text style={styles.headerSubtitle}>LEMBAR AUDIT KEPATUHAN (OK / NOK)</Text>
              </View>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {outlet?.name || 'Outlet Cabang'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <MaterialIcons name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Body Content */}
          {isLoadingChecklist ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Memuat formulir audit kepatuhan...</Text>
            </View>
          ) : step === 'checklist' ? (
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Live Compliance Summary Banner */}
              <View style={styles.summaryCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.summaryLabel}>TINGKAT KEPATUHAN</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
                    <Text style={styles.summaryScore}>{summary.percentage}%</Text>
                    <Text style={styles.summaryTotal}>({summary.okCount}/{summary.totalItems} OK)</Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: summary.isCompliant ? COLORS.successLight : COLORS.dangerLight,
                      borderColor: summary.isCompliant ? COLORS.success : COLORS.danger,
                    },
                  ]}
                >
                  <MaterialIcons
                    name={summary.isCompliant ? 'check-circle' : 'cancel'}
                    size={16}
                    color={summary.isCompliant ? COLORS.success : COLORS.danger}
                  />
                  <Text
                    style={[
                      styles.statusBadgeText,
                      { color: summary.isCompliant ? COLORS.success : COLORS.danger },
                    ]}
                  >
                    {summary.isCompliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
                  </Text>
                </View>
              </View>

              {/* Checklist Categories */}
              {categories.map((cat, catIdx) => (
                <View key={cat.id || catIdx} style={{ marginTop: 20 }}>
                  <View style={styles.categoryHeader}>
                    <Text style={styles.categoryTitle}>{cat.name}</Text>
                    <Text style={styles.categoryCount}>
                      {cat.checklists?.length || 0} Poin
                    </Text>
                  </View>

                  <View style={{ gap: 12 }}>
                    {cat.checklists?.map((point: any, ptIdx: number) => {
                      const isOk = complianceStates[point.id] !== false;
                      const hasPhoto = Boolean(findingPhotos[point.id]);

                      return (
                        <View key={point.id || ptIdx} style={styles.pointCard}>
                          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
                            <Text style={styles.pointNumber}>{ptIdx + 1}.</Text>
                            <Text style={styles.pointQuestion}>{point.question}</Text>
                          </View>

                          {/* OK / NOK Toggle Buttons */}
                          <View style={styles.toggleRow}>
                            {/* OK (Centang Hijau) */}
                            <TouchableOpacity
                              onPress={() => togglePointCompliance(point.id, true)}
                              activeOpacity={0.8}
                              style={[
                                styles.toggleBtn,
                                isOk ? styles.toggleBtnActiveOk : styles.toggleBtnInactive,
                              ]}
                            >
                              <MaterialIcons
                                name="check"
                                size={18}
                                color={isOk ? '#FFFFFF' : COLORS.textSecondary}
                              />
                              <Text
                                style={[
                                  styles.toggleBtnText,
                                  { color: isOk ? '#FFFFFF' : COLORS.textSecondary, fontWeight: isOk ? '800' : '600' },
                                ]}
                              >
                                Sesuai (OK)
                              </Text>
                            </TouchableOpacity>

                            {/* NOK (Silang Merah) */}
                            <TouchableOpacity
                              onPress={() => togglePointCompliance(point.id, false)}
                              activeOpacity={0.8}
                              style={[
                                styles.toggleBtn,
                                !isOk ? styles.toggleBtnActiveNok : styles.toggleBtnInactive,
                              ]}
                            >
                              <MaterialIcons
                                name="close"
                                size={18}
                                color={!isOk ? '#FFFFFF' : COLORS.textSecondary}
                              />
                              <Text
                                style={[
                                  styles.toggleBtnText,
                                  { color: !isOk ? '#FFFFFF' : COLORS.textSecondary, fontWeight: !isOk ? '800' : '600' },
                                ]}
                              >
                                Temuan (NOK)
                              </Text>
                            </TouchableOpacity>
                          </View>

                          {/* Expanded Finding Notes & Photo Attachment if NOK */}
                          {!isOk && (
                            <View style={styles.findingNoteBox}>
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                                <MaterialIcons name="report-problem" size={14} color={COLORS.danger} />
                                <Text style={styles.findingNoteLabel}>Catatan Temuan Ketidaksesuaian:</Text>
                              </View>
                              <TextInput
                                placeholder="Tuliskan detail temuan atau bukti ketidaksesuaian..."
                                placeholderTextColor={COLORS.textMuted}
                                value={findingNotes[point.id] || ''}
                                onChangeText={(text) =>
                                  setFindingNotes((prev) => ({ ...prev, [point.id]: text }))
                                }
                                style={styles.findingNoteInput}
                                multiline
                              />

                              {/* Photo Evidence Section */}
                              <View style={{ marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(220, 38, 38, 0.15)' }}>
                                <Text style={{ ...TYPE.micro, color: COLORS.textSecondary, marginBottom: 6 }}>
                                  Foto Bukti Temuan:
                                </Text>

                                {hasPhoto ? (
                                  <View style={styles.photoPreviewRow}>
                                    <View style={styles.photoContainer}>
                                      <Image
                                        source={{ uri: findingPhotos[point.id] }}
                                        style={styles.photoImage}
                                        resizeMode="cover"
                                      />
                                      <TouchableOpacity
                                        onPress={() => handleRemovePhoto(point.id)}
                                        style={styles.photoDeleteBtn}
                                        activeOpacity={0.8}
                                        accessibilityLabel="Hapus foto"
                                      >
                                        <MaterialIcons name="close" size={14} color="#FFFFFF" />
                                      </TouchableOpacity>
                                    </View>

                                    <TouchableOpacity
                                      onPress={() => handleCapturePhoto(point.id)}
                                      activeOpacity={0.7}
                                      style={styles.photoRetakeBtn}
                                    >
                                      <MaterialIcons name="flip-camera-ios" size={16} color={COLORS.danger} />
                                      <Text style={styles.photoRetakeText}>Ambil Ulang</Text>
                                    </TouchableOpacity>
                                  </View>
                                ) : (
                                  <TouchableOpacity
                                    onPress={() => handleCapturePhoto(point.id)}
                                    activeOpacity={0.8}
                                    style={styles.addPhotoBtn}
                                  >
                                    <MaterialIcons name="camera-alt" size={18} color={COLORS.danger} />
                                    <Text style={styles.addPhotoText}>Ambil Foto Bukti Temuan</Text>
                                  </TouchableOpacity>
                                )}
                              </View>
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                </View>
              ))}

              {/* General Notes */}
              <View style={{ marginTop: 24 }}>
                <Text style={styles.fieldLabel}>Catatan Keseluruhan Auditor:</Text>
                <TextInput
                  placeholder="Catatan umum atau rekomendasi perbaikan outlet..."
                  placeholderTextColor={COLORS.textMuted}
                  value={generalNotes}
                  onChangeText={setGeneralNotes}
                  style={styles.generalNotesInput}
                  multiline
                />
              </View>

              {/* Bottom Proceed Button */}
              <TouchableOpacity
                onPress={handleProceedToSignature}
                activeOpacity={0.85}
                style={styles.primaryBtn}
              >
                <Text style={styles.primaryBtnText}>Lanjut ke Pengesahan & Tanda Tangan</Text>
                <MaterialIcons name="arrow-forward" size={18} color={COLORS.onBrand} />
              </TouchableOpacity>
            </ScrollView>
          ) : step === 'signature' ? (
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
              scrollEnabled={isScrollEnabled}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Back to Checklist Button */}
              <TouchableOpacity
                onPress={() => setStep('checklist')}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16 }}
              >
                <MaterialIcons name="arrow-back" size={18} color={COLORS.primary} />
                <Text style={{ ...TYPE.label, color: COLORS.primary }}>Kembali ke Lembar Checklist</Text>
              </TouchableOpacity>

              {/* Inspection Summary Card */}
              <View style={styles.summaryCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.summaryLabel}>HASIL AKHIR INSPEKSI</Text>
                  <Text style={styles.summaryScore}>{summary.percentage}% Kepatuhan</Text>
                  <Text style={{ ...TYPE.micro, color: COLORS.textSecondary, marginTop: 2 }}>
                    {summary.okCount} Poin Sesuai • {summary.nokCount} Temuan NOK
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: summary.isCompliant ? COLORS.successLight : COLORS.dangerLight,
                      borderColor: summary.isCompliant ? COLORS.success : COLORS.danger,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      { color: summary.isCompliant ? COLORS.success : COLORS.danger },
                    ]}
                  >
                    {summary.isCompliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
                  </Text>
                </View>
              </View>

              {/* Auditor Name Field */}
              <View style={{ marginTop: 20 }}>
                <Text style={styles.fieldLabel}>Nama Auditor:</Text>
                <TextInput
                  value={formAuditorName}
                  onChangeText={setFormAuditorName}
                  placeholder="Nama Lengkap Auditor"
                  style={styles.textInput}
                />
              </View>

              {/* Auditor Signature */}
              <View style={{ marginTop: 16 }}>
                <SignaturePad
                  label="Tanda Tangan Digital Auditor"
                  signerName={formAuditorName || auditorName}
                  onSignatureChange={(hasSig, data) => {
                    setAuditorSigned(hasSig);
                    setAuditorSignatureData(data || '');
                  }}
                  onBeginDrawing={() => setIsScrollEnabled(false)}
                  onEndDrawing={() => setIsScrollEnabled(true)}
                  height={130}
                />
              </View>

              {/* PIC Outlet Name Field */}
              <View style={{ marginTop: 20 }}>
                <Text style={styles.fieldLabel}>Nama Store Manager / PIC Outlet:</Text>
                <TextInput
                  value={picName}
                  onChangeText={setPicName}
                  placeholder="Nama Store Manager yang bertugas"
                  style={styles.textInput}
                />
              </View>

              {/* PIC Signature */}
              <View style={{ marginTop: 16 }}>
                <SignaturePad
                  label="Tanda Tangan PIC / Store Manager"
                  signerName={picName || 'Store Manager Outlet'}
                  onSignatureChange={(hasSig, data) => {
                    setPicSigned(hasSig);
                    setPicSignatureData(data || '');
                  }}
                  onBeginDrawing={() => setIsScrollEnabled(false)}
                  onEndDrawing={() => setIsScrollEnabled(true)}
                  height={130}
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmitAudit}
                disabled={isSubmitting}
                activeOpacity={0.85}
                style={[styles.primaryBtn, { marginTop: 28, backgroundColor: COLORS.success }]}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <MaterialIcons name="verified" size={20} color="#FFFFFF" />
                    <Text style={styles.primaryBtnText}>Sahkan & Simpan Hasil Audit</Text>
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
          ) : (
            /* Success Step */
            <View style={{ flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' }}>
              <View
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 36,
                  backgroundColor: summary.isCompliant ? COLORS.successLight : COLORS.dangerLight,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}
              >
                <MaterialIcons
                  name={summary.isCompliant ? 'check-circle' : 'error'}
                  size={44}
                  color={summary.isCompliant ? COLORS.success : COLORS.danger}
                />
              </View>

              <Text style={{ ...TYPE.h1, color: COLORS.textMain, textAlign: 'center' }}>
                {summary.isCompliant ? 'Inspeksi Berhasil Disahkan!' : 'Inspeksi Selesai (Ada Temuan)'}
              </Text>

              <Text
                style={{
                  ...TYPE.body,
                  fontSize: 14,
                  color: COLORS.textSecondary,
                  textAlign: 'center',
                  marginTop: 6,
                  maxWidth: 280,
                }}
              >
                Hasil audit kepatuhan untuk {outlet?.name} telah tercatat resmi dengan skor {summary.percentage}%.
              </Text>

              <TouchableOpacity
                onPress={handleFinish}
                style={[styles.primaryBtn, { width: '100%', marginTop: 32 }]}
              >
                <Text style={styles.primaryBtnText}>Selesai</Text>
              </TouchableOpacity>
            </View>
          )}
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    height: '92%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    backgroundColor: COLORS.surface,
  },
  headerSubtitle: {
    ...TYPE.micro,
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  headerTitle: {
    ...TYPE.h2,
    color: COLORS.textMain,
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    ...TYPE.body,
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 10,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surfaceSunken,
    padding: 16,
    borderRadius: RADIUS.lg,
  },
  summaryLabel: {
    ...TYPE.micro,
    color: COLORS.textMuted,
  },
  summaryScore: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  summaryTotal: {
    ...TYPE.label,
    color: COLORS.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  categoryTitle: {
    ...TYPE.h3,
    fontSize: 13.5,
    color: COLORS.textMain,
  },
  categoryCount: {
    ...TYPE.micro,
    color: COLORS.textMuted,
  },
  pointCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  pointNumber: {
    ...TYPE.label,
    fontWeight: '700',
    color: COLORS.primary,
  },
  pointQuestion: {
    ...TYPE.body,
    fontSize: 13.5,
    color: COLORS.textMain,
    flex: 1,
    lineHeight: 19,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: RADIUS.sm,
  },
  toggleBtnActiveOk: {
    backgroundColor: COLORS.success,
  },
  toggleBtnActiveNok: {
    backgroundColor: COLORS.danger,
  },
  toggleBtnInactive: {
    backgroundColor: COLORS.surfaceSunken,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  toggleBtnText: {
    fontSize: 12.5,
  },
  findingNoteBox: {
    backgroundColor: COLORS.dangerLight,
    borderRadius: RADIUS.sm,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.2)',
    marginTop: 4,
  },
  findingNoteLabel: {
    ...TYPE.micro,
    color: COLORS.danger,
  },
  findingNoteInput: {
    fontSize: 12.5,
    color: COLORS.textMain,
    minHeight: 44,
    textAlignVertical: 'top',
    padding: 0,
    marginTop: 4,
  },
  addPhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: RADIUS.sm,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.3)',
    borderStyle: 'dashed',
  },
  addPhotoText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.danger,
  },
  photoPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  photoContainer: {
    position: 'relative',
    width: 72,
    height: 72,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoDeleteBtn: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(220, 38, 38, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoRetakeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.2)',
  },
  photoRetakeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.danger,
  },
  fieldLabel: {
    ...TYPE.label,
    color: COLORS.textMain,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: COLORS.surfaceSunken,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 14,
    color: COLORS.textMain,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  generalNotesInput: {
    backgroundColor: COLORS.surfaceSunken,
    borderRadius: RADIUS.md,
    padding: 12,
    minHeight: 64,
    fontSize: 13,
    color: COLORS.textMain,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  primaryBtn: {
    backgroundColor: COLORS.brandDeep,
    height: 52,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.onBrand,
  },
});
